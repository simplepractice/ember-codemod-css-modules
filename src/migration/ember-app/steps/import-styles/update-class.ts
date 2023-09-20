/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-javascript';
import { createFiles, parseFilePath } from '@codemod-utils/files';

import type { Entry, Options } from '../../../../types/index.js';

type Data = {
  __styles__: string;
  fileName: string;
};

function ensureImports(file: string, data: Data): string {
  const traverse = AST.traverse(false);

  let lastImportDeclarationPath: unknown;
  let decoratorImportDeclarationPath: unknown;

  const ast = traverse(file, {
    visitImportDeclaration(path) {
      if (!lastImportDeclarationPath) {
        lastImportDeclarationPath = path;
        // @ts-ignore: Assume that types from external packages are correct
      } else if (path.node.start > lastImportDeclarationPath.node.start) {
        lastImportDeclarationPath = path;
      }

      if (path.value.source.value === '@ember-decorators/component') {
        decoratorImportDeclarationPath = path;
      }

      return false;
    },
  });

  // @ts-ignore: Assume that types from external packages are correct
  const nodes = ast.program.body;
  // @ts-ignore: Assume that types from external packages are correct
  let index = lastImportDeclarationPath?.name ?? -1;

  if (decoratorImportDeclarationPath) {
    // @ts-ignore: Assume that types from external packages are correct
    let specifiers = decoratorImportDeclarationPath.value.specifiers;
    // @ts-ignore: Assume that types from external packages are correct
    if (!specifiers.find((x) => x.imported.name === 'classNames')) {
      specifiers.push(AST.builders.importSpecifier(
        AST.builders.identifier('classNames')
      ));
    }
  } else {
    nodes.splice(
      index,
      0,
      AST.builders.importDeclaration(
        [
          AST.builders.importSpecifier(
            AST.builders.identifier('classNames')
          ),
        ],
        AST.builders.literal('@ember-decorators/component'),
      ),
    );
  }

  nodes.splice(
    index,
    0,
    AST.builders.importDeclaration(
      [
        AST.builders.importDefaultSpecifier(
          AST.builders.identifier(data.__styles__),
        ),
      ],
      AST.builders.literal(`./${data.fileName}.module.scss`),
    ),
  );

  return AST.print(ast);
}

function ensureModifier(file: string, data: Data): string {
  const traverse = AST.traverse(false);

  const ast = traverse(file, {
    visitClassDeclaration(path) {
      if (!path.value.decorators) path.value.decorators = [];
      const identifier = AST.builders.identifier(`${data.__styles__}.component`);
      const decorators = path.value.decorators;

      // @ts-ignore: Assume that types from external packages are correct
      const classNamesDecorator = decorators.find(x => x.expression.callee?.name == 'classNames');

      if (classNamesDecorator) {
        classNamesDecorator.expression.arguments.push(identifier);
      } else {
        decorators.push(
          AST.builders.decorator(
            AST.builders.callExpression(AST.builders.identifier('classNames'), [identifier])
          )
        );
      }

      return false;
    },
  });

  return AST.print(ast);
}


function ensureAttribute(file: string, data: Data): string {
  const traverse = AST.traverse(false);

  const ast = traverse(file, {
    visitClassDeclaration(path) {
      const { body } = path.node.body;

      const nodesToAdd = [
        AST.builders.classProperty(
          AST.builders.identifier(data.__styles__),
          AST.builders.identifier(data.__styles__),
        ),
      ];

      if (body.length > 0) {
        // @ts-ignore: Assume that types from external packages are correct
        nodesToAdd.push(AST.builders.noop());
      }

      body.unshift(...nodesToAdd);

      return false;
    },
  });

  return AST.print(ast);
}
export function updateClass(
  entry: Entry,
  options: Options,
): void {
  const { __styles__, projectRoot } = options;
  const { jsPath } = entry;
  const { name } = parseFilePath(jsPath);

  const data = {
    __styles__,
    fileName: name,
  };

  try {
    let file = readFileSync(join(projectRoot, jsPath), 'utf8');
    file = ensureImports(file, data);
    file = ensureModifier(file, data);
    if (entry.hasHbsUsage) file = ensureAttribute(file, data);

    const fileMap = new Map([[jsPath, file]]);

    createFiles(fileMap, options);
  } catch (error) {
    let message = `WARNING: updateClass could not update \`${jsPath}\`. Please update the file manually.`;

    if (error instanceof Error) {
      message += ` (${error.message})`;
    }

    console.warn(`${message}\n`);
  }
}
