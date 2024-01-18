import "chai/register-should";
import { config } from "chai";
import { stepCounter } from "../src/21-step-counter";
import { readFileSync } from "fs";
import { beforeAll, describe, it } from "@jest/globals";
import { JestReporter } from "approvals/lib/Providers/Jest/JestReporter";
import { verify } from "approvals/lib/Providers/Jest/JestApprovals";

config.truncateThreshold = 0;

describe("stepCounter", () => {
  describe("given single row of only plots", () => {
    it.each([
      [1, "S\n"],
      [2, "S.\n"],
      [3, "S..\n"],
      [
        64,
        "S...............................................................\n",
      ],
      [
        64,
        "S................................................................\n",
      ],
    ])("returns %p when %p", (expected, input) => {
      stepCounter(input).should.equal(expected);
    });
  });

  xdescribe("given puzzle description input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/21-step-counter-from-puzzle-description.txt",
        "utf-8",
      );
      stepCounter(input).should.equal(expected);
    });
  });

  xdescribe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/21-step-counter.txt", "utf-8");
      stepCounter(input).should.equal(expected);
    });
  });
});
