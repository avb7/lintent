import { spawn } from "child_process";
import type { DetectedLinter, LinterViolation, LinterRunResult } from "./types.js";
import { parseRuffOutput } from "./ruff.js";
import { parsePyrightOutput } from "./pyright.js";
import { parseEslintOutput } from "./eslint.js";
import { parseTypescriptOutput } from "./typescript.js";

/**
 * Run a linter and return its output
 */
async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<{ stdout: string; stderr: string; exitCode: number; notFound: boolean }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd,
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      // Check if command not found (typically exit code 127 or specific error messages)
      const notFound = 
        code === 127 || 
        stderr.includes("command not found") ||
        stderr.includes("not found") ||
        stderr.includes("not recognized") ||
        stderr.includes("ENOENT");
      
      resolve({
        stdout,
        stderr,
        // Default to 1 for unknown exit codes to avoid masking failures
        exitCode: code ?? 1,
        notFound,
      });
    });

    proc.on("error", (err) => {
      const notFound = err.message.includes("ENOENT") || err.message.includes("not found");
      resolve({
        stdout: "",
        stderr: err.message,
        exitCode: 1,
        notFound,
      });
    });
  });
}

/**
 * Run a single linter and parse its output
 */
export async function runLinter(
  linter: DetectedLinter,
  cwd: string
): Promise<LinterRunResult> {
  const args = [...linter.args, ...linter.paths];
  const fullCommand = `${linter.command} ${args.join(" ")}`;

  const result = await runCommand(linter.command, args, cwd);

  // Check if command was not found
  if (result.notFound) {
    return {
      name: linter.name,
      status: "not_found",
      violations: [],
      error: `'${linter.command}' is not installed. Install it with: ${getInstallHint(linter.name)}`,
      command: fullCommand,
    };
  }

  // Parse the output
  const output = result.stdout || result.stderr;
  let violations: LinterViolation[] = [];

  try {
    switch (linter.name) {
      case "ruff":
        violations = parseRuffOutput(output);
        break;
      case "pyright":
        violations = parsePyrightOutput(output);
        break;
      case "eslint":
        violations = parseEslintOutput(output);
        break;
      case "typescript":
        violations = parseTypescriptOutput(output);
        break;
      default:
        return {
          name: linter.name,
          status: "error",
          violations: [],
          error: `Unknown linter '${linter.name}' - no parser available`,
          command: fullCommand,
        };
    }

    return {
      name: linter.name,
      status: "success",
      violations,
      command: fullCommand,
    };
  } catch (err) {
    return {
      name: linter.name,
      status: "error",
      violations: [],
      error: err instanceof Error ? err.message : String(err),
      command: fullCommand,
    };
  }
}

/**
 * Get installation hint for a linter
 */
function getInstallHint(linter: string): string {
  switch (linter) {
    case "ruff":
      return "pip install ruff (or: brew install ruff)";
    case "pyright":
      return "pip install pyright (or: npm install -g pyright)";
    case "eslint":
      return "npm install eslint";
    case "typescript":
      return "npm install typescript";
    default:
      return `install ${linter}`;
  }
}

/**
 * Run all linters in parallel and collect results
 */
export async function runAllLinters(
  linters: DetectedLinter[],
  cwd: string
): Promise<LinterRunResult[]> {
  const results = await Promise.all(
    linters.map((linter) => runLinter(linter, cwd))
  );

  return results;
}
