import { findFiles } from '@codemod-utils/files';
import type { Context, Options } from '../../../types/index.js';

export function findStyles(options: Options): string[] {
  const { projectRoot } = options;

  return findFiles('{app,addon}/styles/component-styles/**/*.{css,scss}', {
    projectRoot,
  });
}

export function analyzeApp(options: Options): Context {
  return findStyles(options).map(oldPath => {
    const newPath = oldPath.replace('styles/component-styles', 'components').replace(/\.(.+)$/i, `.module.$1`);
    const jsPath = newPath.replace(/\.(.+)$/i, '.js');
    const hbsPath = newPath.replace(/\.(.+)$/i, '.hbs');
    const entityName = jsPath.split('components/')[1]?.replace('.js', '') || '';

    return {
      entityName,
      oldPath,
      newPath,
      jsPath,
      hbsPath,
      hasHbsUsage: false,
    }
  });
}
