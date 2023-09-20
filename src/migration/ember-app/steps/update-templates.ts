import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import type { Context, Options } from '../../../types/index.js';
import { AST } from '@codemod-utils/ast-template';

const expressionsToReplace = ['this.styleNamespace', 'this.componentCssClassName'];
const replaceWith = 'this.styles.component';

function replaceHbsUsage(filePath: string): boolean {
  if (!existsSync(filePath)) return false;

  let didReplace = false;
  const contents = readFileSync(filePath).toString();

  const traverse = AST.traverse();
  const ast = traverse(contents, {
    PathExpression(path: any) {
      if (!expressionsToReplace.includes(path.original)) return;
      path.original = replaceWith;
      didReplace = true;
    },
  });

  writeFileSync(filePath, AST.print(ast));
  return didReplace;
}

export function updateTemplates(context: Context, options: Options): void {
  for (const entry of context) {
    if (replaceHbsUsage(`${options.projectRoot}/${entry.hbsPath}`)) {
      entry.hasHbsUsage = true;
    }
  }
}
