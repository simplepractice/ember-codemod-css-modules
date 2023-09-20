import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { processTemplate } from '@codemod-utils/blueprints';
import { classify, doubleColonize } from '@codemod-utils/ember-cli-string';
import { createFiles, parseFilePath } from '@codemod-utils/files';

import type { Entry, Options } from '../../../../types/index.js';
import { blueprintsRoot } from '../../../../utils/blueprints.js';

export function createClass(
  entry: Entry,
  options: Options,
): void {
  const { entityName, jsPath } = entry;

  const entity = {
    classifiedName: classify(entityName),
    doubleColonizedName: doubleColonize(entityName),
    fileName: parseFilePath(entityName).name,
    name: entityName,
  };

  const fileMap = new Map(
    ['ember-cli/component/javascript.js'].map((blueprintFilePath) => {
      const blueprintFile = readFileSync(
        join(blueprintsRoot, blueprintFilePath),
        'utf8',
      );

      const file = processTemplate(blueprintFile, {
        entity,
        options,
      });

      return [jsPath, file];
    }),
  );

  createFiles(fileMap, options);
}
