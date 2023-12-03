import "chai/register-should";
import { config } from "chai";
import { gearRatios } from "../src/gearRatios";
import { readFileSync } from "fs";
import { beforeAll, describe, it } from "@jest/globals";
import { JestReporter } from "approvals/lib/Providers/Jest/JestReporter";
import { verify } from "approvals/lib/Providers/Jest/JestApprovals";
import { configure } from "approvals";

config.truncateThreshold = 0;

describe("gearRatios", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      gearRatios(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/gearRatios.txt", "utf-8");
      gearRatios(input).should.equal(expected);
    });
  });
});

describe("printBooleanMatrix", () => {
  function printBooleanMatrix(booleanMatrix: boolean[][]) {
    let output = "";
    for (const row of booleanMatrix) {
      output += row.map((b) => (b ? "1" : ".")).join("") + "\n";
    }
    return output;
  }

  beforeAll(() => {
    configure({
      reporters: [new JestReporter()],
    });
  });

  it("should print", () => {
    const booleanMatrix: boolean[][] = [
      [true, false, false, false],
      [false, true, false, false],
      [false, false, true, false],
      [false, false, false, false, false],
      [true, true, true, true, true],
    ];
    verify(printBooleanMatrix(booleanMatrix));
  });
});
