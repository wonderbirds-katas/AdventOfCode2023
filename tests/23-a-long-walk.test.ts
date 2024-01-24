import "chai/register-should";
import { config } from "chai";
import { aLongWalk } from "../src/23-a-long-walk";
import { readFileSync } from "fs";
import { describe, it } from "@jest/globals";

config.truncateThreshold = 0;

describe("aLongWalk", () => {
  describe("given 1D vertical paths", () => {
    it.each([
      [0, "."],
      [1, ".\n."],
      [2, ".\n.\n."],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given vertical paths in second column", () => {
    it.each([
      [0, "#."],
      [1, "#.\n#."],
      [2, "#.\n#.\n#."],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given vertical forcing to walk down or left", () => {
    it.each([
      [3, "#.\n..\n.#"],
      [
        5,
        `##.
#..
..#
.##`,
      ],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given vertical forcing to walk down or right", () => {
    it.each([
      [3, ".#\n..\n#."],
      [
        5,
        `.##
..#
#..
##.`,
      ],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given vertical forcing to walk up", () => {
    it.each([
      [
        9,
        `.####
.#...
...#.
####.`,
      ],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given two paths of different length", () => {
    it.each([
      [
        15,
        `.####
.....
.#.#.
.#.#.
...#.
####.`,
      ],
    ])("returns %p when %p", (expected, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given slope down to the east", () => {
    it.each([[4, "when walking to the east", ".##\n.>.\n##."]])(
      "returns %p when %s",
      (expected, description, input) => {
        aLongWalk(input).should.equal(expected);
      },
    );

    it.each([
      [0, "when walking to the south", "#.#\n#>#\n#.#"],
      [0, "when walking to the west", "#.#\n.>#\n.##"],
      [
        0,
        "when walking to the north",
        `.####
.#...
.#>#.
...#.
####.`,
      ],
    ])("returns %p when %s", (expected, description, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given slope down to the south", () => {
    it.each([[2, "when walking to the south", "#.#\n#v#\n#.#"]])(
      "returns %p when %s",
      (expected, description, input) => {
        aLongWalk(input).should.equal(expected);
      },
    );

    it.each([
      [0, "when walking to the east", ".##\n.v.\n##."],
      [0, "when walking to the west", "#.#\n.v#\n.##"],
      [
        0,
        "when walking to the north",
        `.####
.#...
.#v#.
...#.
####.`,
      ],
    ])("returns %p when %s", (expected, description, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given slope down to the west", () => {
    it.each([[3, "when walking to the west", "#.#\n.<#\n.##"]])(
      "returns %p when %s",
      (expected, description, input) => {
        aLongWalk(input).should.equal(expected);
      },
    );

    it.each([
      [0, "when walking to the east", ".##\n.<.\n##."],
      [0, "when walking to the south", "#.#\n#<#\n#.#"],
      [
        0,
        "when walking to the north",
        `.####
.#...
.#<#.
...#.
####.`,
      ],
    ])("returns %p when %s", (expected, description, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given slope down to the north", () => {
    it.each([
      [
        12,
        "when walking to the north",
        `.####
.#...
.#^#.
...#.
####.`,
      ],
    ])("returns %p when %s", (expected, description, input) => {
      aLongWalk(input).should.equal(expected);
    });

    it.each([
      [0, "when walking to the east", ".##\n.^.\n##."],
      [0, "when walking to the south", "#.#\n#^#\n#.#"],
      [0, "when walking to the west", "#.#\n.^#\n.##"],
    ])("returns %p when %s", (expected, description, input) => {
      aLongWalk(input).should.equal(expected);
    });
  });

  describe("given puzzle description input", () => {
    it.each([[94]])("returns %p", (expected) => {
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
