import "chai/register-should";
import { config } from "chai";
import { day2part1 } from "../src/day2part1";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("day2part1", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      day2part1(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/day2part1.txt", "utf-8");
      day2part1(input).should.equal(expected);
    });
  });
});
