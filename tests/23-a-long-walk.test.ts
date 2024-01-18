import "chai/register-should";
import { config } from "chai";
import { aLongWalk } from "../src/23-a-long-walk";
import { readFileSync } from "fs";
import { beforeAll, describe, it } from "@jest/globals";
import { JestReporter } from "approvals/lib/Providers/Jest/JestReporter";
import { verify } from "approvals/lib/Providers/Jest/JestApprovals";

// @ts-ignore: unfortunately, approvals/lib/Approvals.js implicitly has an any type
import { configure } from "approvals";

config.truncateThreshold = 0;

describe("aLongWalk", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given puzzle description input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/23-a-long-walk-from-puzzle-description.txt",
        "utf-8",
      );
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/23-a-long-walk.txt", "utf-8");
      aLongWalk(input).should.equal(expected);
    });
  });
});
