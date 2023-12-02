import "chai/register-should";
import { config } from "chai";
import { solution } from "../src/00-template";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("solution", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      solution(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/00-template.txt", "utf-8");
      solution(input).should.equal(expected);
    });
  });
});
