import type { CodemodOptions, Options } from '../../../types/index.js';

export function createOptions(codemodOptions: CodemodOptions): Options {
  const options = {
    __styles__: 'styles',
    projectRoot: codemodOptions.projectRoot,
  };

  return options;
}
