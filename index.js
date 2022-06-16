#! /usr/bin/env node
import { Command } from 'commander';
import attachments from './commands/attachments.js';

const program = new Command();

program
  .command('attachments <filePath>')
  .description('export all attachments')
  .action(attachments);

program.parse();
