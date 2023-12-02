import "chai/register-should";
import { config } from "chai";
import { cubeConundrum } from "../src/cubeConundrum";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("cubeConundrum", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      cubeConundrum(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    xit.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/cubeConundrum.txt", "utf-8");
      cubeConundrum(input).should.equal(expected);
    });
  });
});
