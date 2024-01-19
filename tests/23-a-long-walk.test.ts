import "chai/register-should";
import { config } from "chai";
import { aLongWalk } from "../src/23-a-long-walk";
import { readFileSync } from "fs";
import { describe, it } from "@jest/globals";

config.truncateThreshold = 0;

describe("aLongWalk", () => {
  describe("given 1D vertical paths", () => {
    it.each([
      [1, "."],
      [2, ".\n."],
      [3, ".\n.\n."],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given vertical paths in second column", () => {
    it.each([
      [1, "#."],
      [2, "#.\n#."],
      [3, "#.\n#.\n#."],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given vertical forcing to walk down or left", () => {
    it.each([
      [4, "#.\n..\n.#"],
      [
        6,
        `##.
#..
..#
.##`,
      ],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  xdescribe("given puzzle description input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/23-a-long-walk-from-puzzle-description.txt",
        "utf-8",
      );
      aLongWalk(input).should.equal(expected);
    });
  });

  xdescribe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/23-a-long-walk.txt", "utf-8");
      aLongWalk(input).should.equal(expected);
    });
  });
});
