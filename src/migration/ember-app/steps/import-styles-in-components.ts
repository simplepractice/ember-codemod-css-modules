import { existsSync } from 'node:fs';
import {
  Context,
  Options,
} from '../../../types/index.js';
import { createClass } from './import-styles/create-class.js';
import { updateClass } from './import-styles/update-class.js';

export function importStylesInComponents(
  context: Context,
  options: Options,
): void {
  for (const entry of context) {
    const { jsPath } = entry;

    const hasClass = existsSync(`${options.projectRoot}/${jsPath}`);
    if (!hasClass) {
      createClass(entry, options);
    }

    updateClass(entry, options);
  }
}
