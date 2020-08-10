#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { ParseService } from './parse.service';

const program = new Command();

program
  .version(require('../package.json').version, '-v, --version', 'output the current version')
  .requiredOption('-i, --input <input>', 'Reporting file')
  .option('-o, --output <output>', 'Result file', 'out.csv')
  .action((options: { input: string; output: string }) =>
    fs.promises
      .readFile(path.resolve(options.input.trim()), { encoding: 'utf-8' })
      .then(content => content.split(/\r?\n/).filter(line => !!line))
      .then(lines => new ParseService().parse(lines))
      .then(times => fs.promises.writeFile(options.output, times.join('\n,')))
      .then(() => process.exit(0))
  );

program.parse(process.argv);
