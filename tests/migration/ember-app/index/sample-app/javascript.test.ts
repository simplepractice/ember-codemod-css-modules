import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { migrateEmberApp } from '../../../../../src/migration/ember-app/index.js';
import {
  inputProject,
  outputProject,
} from '../../../../fixtures/sample-app/index.js';
import { codemodOptions } from '../../../../helpers/shared-test-setups/javascript.js';

test('migration | ember-app | index | sample-app > javascript', async function () {
  loadFixture(inputProject, codemodOptions);

  await migrateEmberApp(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  await migrateEmberApp(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
