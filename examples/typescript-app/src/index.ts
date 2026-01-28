/**
 * Main module with intentional lint violations for lintent testing.
 */

import { readFile } from "fs"; // @typescript-eslint/no-unused-vars: unused import

import { formatData, DataProcessor } from "./utils.js";

// no-unused-vars: declared but never used
let unusedVariable = "hello";

// prefer-const: should be const since never reassigned
let mutableButNeverReassigned = 42;

// @typescript-eslint/no-explicit-any: implicit any parameter
function processData(data) {
  // no-console: console in production code
  console.log("Processing data...");

  // TS2322: Type 'string' is not assignable to type 'number'
  const count: number = "not a number";

  // eqeqeq: using == instead of ===
  if (data == null) {
    return [];
  }

  return data;
}

// @typescript-eslint/no-explicit-any: any return type
function fetchUserData(userId: number): any {
  // no-console
  console.log(`Fetching user ${userId}`);

  // TS2322: returning wrong type
  const result: string[] = [1, 2, 3];

  return {
    id: userId,
    name: "John Doe",
    data: result,
  };
}

// no-var: using var instead of let/const
var globalConfig = {
  debug: true,
  version: "1.0.0",
};

class UserService {
  private users: Map<number, string>;

  constructor() {
    this.users = new Map();
  }

  // @typescript-eslint/no-explicit-any: any parameter
  addUser(id: number, data: any) {
    // no-console
    console.log("Adding user");

    // prefer-const
    let userName = data.name;

    this.users.set(id, userName);
  }

  // TS7006: Parameter 'callback' implicitly has an 'any' type
  processUsers(callback) {
    this.users.forEach((name, id) => {
      callback(id, name);
    });
  }
}

function main() {
  const processor = new DataProcessor([1, 2, 3]);
  const formatted = formatData("test");

  // no-console
  console.log("Running TypeScript example app...");
  console.log(`Formatted: ${formatted}`);

  const service = new UserService();
  service.addUser(1, { name: "Alice" });

  // eqeqeq: loose equality
  if (globalConfig.version == "1.0.0") {
    console.log("Version 1.0.0");
  }
}

main();
