import { migrateEmberApp } from './migration/index.js';
import type { CodemodOptions } from './types/index.js';

export function processCodemod(codemodOptions: CodemodOptions): Promise<void> {
  return migrateEmberApp(codemodOptions);
}
