import "chai/register-should";
import { config } from "chai";
import { day3part1 } from "../src/day3part1";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("day3part1", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      day3part1(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/day3part1.txt", "utf-8");
      day3part1(input).should.equal(expected);
    });
  });
});
