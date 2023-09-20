import type { CodemodOptions } from '../../types/index.js';
import {
  analyzeApp,
  createOptions,
  importStylesInComponents,
  moveStylesheets,
  updateTemplates,
} from './steps/index.js';

export async function migrateEmberApp(codemodOptions: CodemodOptions): Promise<void> {
  const options = createOptions(codemodOptions);

  // Prepare for migration
  const context = analyzeApp(options);

  // Move and reformat
  await moveStylesheets(context, options);

  // Update template path references
  updateTemplates(context, options);

  // Import styles in classes
  importStylesInComponents(context, options);
}
