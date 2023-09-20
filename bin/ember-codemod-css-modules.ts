#!/usr/bin/env node
// eslint-disable-next-line n/shebang
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { processCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'ember-codemod-css-modules';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('root', {
    describe: 'Location of your Ember project',
    type: 'string',
  })
  .parseSync();

const codemodOptions: CodemodOptions = {
  projectRoot: argv['root'] ?? process.cwd(),
};

await processCodemod(codemodOptions);
