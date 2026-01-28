#!/usr/bin/env node

import { Command } from "commander";
import { runCommand } from "./commands/run.js";
import { initCommand } from "./commands/init.js";
import { validateCommand } from "./commands/validate.js";
import { listCommand } from "./commands/list.js";
import { guideCommand } from "./commands/guide.js";

const LOGO = `
░██ ░██              ░██                             ░██    
░██                  ░██                             ░██    
░██ ░██░████████  ░████████  ░███████  ░████████  ░████████ 
░██ ░██░██    ░██    ░██    ░██    ░██ ░██    ░██    ░██    
░██ ░██░██    ░██    ░██    ░█████████ ░██    ░██    ░██    
░██ ░██░██    ░██    ░██    ░██        ░██    ░██    ░██    
░██ ░██░██    ░██     ░████  ░███████  ░██    ░██     ░████ 

  Make slop illegal.
  https://avb7.github.io/lintent
`;

const program = new Command();

program
  .name("lintent")
  .description("A lint runner that enriches violations with semantic meaning for LLMs")
  .version("0.1.0");

program
  .command("run")
  .description("Run all linters and output enriched report")
  .option("-c, --config <path>", "Path to lintent.yaml")
  .option("-t, --tool <name>", "Run only specific linter")
  .option("-p, --pretty", "Pretty-print JSON output")
  .action(async (options) => {
    await runCommand(options);
  });

program
  .command("init")
  .description("Create starter lintent.yaml")
  .option("--preset <name>", "Use preset (python, typescript)", "python")
  .option("-p, --pretty", "Pretty-print JSON output")
  .action(async (options) => {
    await initCommand(options);
  });

program
  .command("validate")
  .description("Validate lintent.yaml structure")
  .option("-c, --config <path>", "Path to lintent.yaml")
  .option("-p, --pretty", "Pretty-print JSON output")
  .action(async (options) => {
    await validateCommand(options);
  });

program
  .command("list")
  .description("List all defined semantic rules")
  .option("-c, --config <path>", "Path to lintent.yaml")
  .option("-p, --pretty", "Pretty-print JSON output")
  .action(async (options) => {
    await listCommand(options);
  });

program
  .command("guide [topic]")
  .description("Output AI agent guide (topics: setup, fix, config, rules, customize)")
  .action(async (topic) => {
    await guideCommand(topic);
  });

// Show logo when called without arguments
if (process.argv.length === 2) {
  console.log(LOGO);
  program.outputHelp();
} else {
  program.parse();
}
