import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('sample-app/input');
const outputProject = convertFixtureToJson('sample-app/output');

export { inputProject, outputProject };
