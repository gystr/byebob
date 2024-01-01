#!/usr/bin/env node

import { program } from "commander";
import { fill } from "./commands/fill.js";
import { submit } from "./commands/submit.js";
import { configure } from "./commands/configure.js";

program
  .command("fill")
  .description("Automatically fill hours on all missing days")
  .action(fill);

program.command("submit").description("Submit hours report").action(submit);

program.command("configure").description("Set up your credentials").action(configure);

program.parse();


