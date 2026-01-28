/**
 * Utility functions with intentional lint violations.
 */

import { EventEmitter } from "events"; // @typescript-eslint/no-unused-vars: unused

// @typescript-eslint/no-explicit-any: any parameter type
export function formatData(input: any): string {
  // no-console
  console.log("Formatting data");

  // prefer-const: never reassigned
  let result = String(input);

  return result;
}

// TS7006: implicit any on parameters
export function calculateSum(a, b) {
  return a + b;
}

// TS2322: return type mismatch
export function getNumbers(): number[] {
  // Returning strings instead of numbers
  return ["one", "two", "three"] as any;
}

export class DataProcessor {
  // @typescript-eslint/no-explicit-any
  private data: any[];

  // TS7006: implicit any
  constructor(initialData) {
    this.data = initialData;
  }

  // @typescript-eslint/no-explicit-any: any return type
  process(): any {
    // no-console
    console.log("Processing...");

    // prefer-const
    let processed = this.data.map((x) => x * 2);

    return processed;
  }

  // TS7006: callback has implicit any
  forEach(callback) {
    this.data.forEach(callback);
  }

  // eqeqeq violation
  isEmpty() {
    return this.data.length == 0;
  }
}

// no-var
var defaultTimeout = 5000;

// @typescript-eslint/no-unused-vars: unused function
function unusedHelper(x: number): number {
  return x * 2;
}

// TS2345: Argument type mismatch
export function processNumbers(nums: number[]): number {
  // This would fail type checking if strict
  const sum = nums.reduce((a, b) => a + b, "0"); // TS2345: string initial value

  // TS2322: returning string as number
  return sum;
}

// Multiple violations in one function
export function messyFunction(input, options, callback) {
  // no-console
  console.log("Messy function called");

  // no-var
  var temp = input;

  // prefer-const
  let result = [];

  // eqeqeq
  if (options == undefined) {
    options = {};
  }

  // @typescript-eslint/no-unused-vars
  let unusedLocal = "not used";

  for (var i = 0; i < 10; i++) {
    result.push(temp + i);
  }

  callback(result);
}
