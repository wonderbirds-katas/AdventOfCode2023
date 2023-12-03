import "chai/register-should";
import { config } from "chai";
import {
  cubeConundrum,
  cubeConundrumPart2,
  cubesIn,
  isGamePossible,
  isSetPossible,
} from "../src/cubeConundrum";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("cubesIn", () => {
  describe("given empty set", () => {
    it("returns 0", () => {
      cubesIn("", "red").should.equal(0);
    });
  });

  describe("given set with only cubes of desired color", () => {
    it.each([
      [1, "red", "1 red"],
      [9, "red", "9 red"],
      [42, "red", "42 red"],
      [193, "green", "193 green"],
      [987845, "blue", "987845 blue"],
    ])(
      "returns %p when %p cubes requested from set %p",
      (expected, color, set) => {
        cubesIn(set, color).should.equal(expected);
      },
    );
  });

  describe("given set with cubes of multiple colors", () => {
    it.each([
      [1, "red", "1 red, 7 blue"],
      [9, "red", "7 blue, 9 red"],
      [912, "green", "7 blue, 9 red, 912 green"],
      [0, "green", "7 blue, 9 red"],
    ])(
      "returns %p when %p cubes requested from set %p",
      (expected, color, set) => {
        cubesIn(set, color).should.equal(expected);
      },
    );
  });
});

describe("isSetPossible", () => {
  describe("given possible set", () => {
    it.each([
      [true, "1 red, 1 green, 1 blue"],
      [true, "12 red, 13 green, 14 blue"],
    ])("returns %p when %p", (expected, set) => {
      isSetPossible(set).should.equal(expected);
    });
  });

  describe("given impossible set", () => {
    it.each([
      [false, "13 red, 1 green, 1 blue"],
      [false, "1 red, 14 green, 1 blue"],
      [false, "1 red, 1 green, 15 blue"],
    ])("returns %p when %p", (expected, set) => {
      isSetPossible(set).should.equal(expected);
    });
  });
});

describe("isGamePossible", () => {
  describe("given empty game string", () => {
    it("returns false", () => {
      isGamePossible("").should.equal(false);
    });
  });

  describe("given possible game", () => {
    it.each([
      [true, "Game 1: 1 red, 1 green, 1 blue"],
      [true, "Game 1: 12 red, 13 green, 14 blue"],
      [true, "Game 1: 12 red, 13 green, 14 blue; 12 red, 13 green, 14 blue"],
    ])("returns %p when %p", (expected, game) => {
      isGamePossible(game).should.equal(expected);
    });
  });

  describe("given impossible game", () => {
    it.each([
      [false, "Game 1: 13 red, 1 green, 1 blue"],
      [false, "Game 1: 1 red, 14 green, 1 blue"],
      [false, "Game 1: 1 red, 1 green, 15 blue"],
      [false, "Game 1: 1 red, 1 green, 1 blue; 1 red, 1 green, 15 blue"],
    ])("returns %p when %p", (expected, game) => {
      isGamePossible(game).should.equal(expected);
    });
  });
});

describe("cubeConundrum", () => {
  describe("given single possible game", () => {
    it.each([
      [1, "Game 1: 1 red, 1 green, 1 blue"],
      [42, "Game 42: 1 red, 1 green, 1 blue"],
      [9958, "Game 9958: 1 red, 1 green, 1 blue"],
    ])("returns %p when %p", (expected, input) => {
      cubeConundrum(input).should.equal(expected);
    });
  });

  describe("given example from puzzle description", () => {
    it.each([
      [
        8,
        `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`,
      ],
    ])("returns %p when %p", (expected, input) => {
      cubeConundrum(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[2486]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/cubeConundrum.txt", "utf-8");
      cubeConundrum(input).should.equal(expected);
    });
  });
});

describe("cubeConundrumPart2", () => {
  describe("given single game of one set", () => {
    it.each([
      [1, "Game 1: 1 red, 1 green, 1 blue"],
      [2, "Game 1: 2 red, 1 green, 1 blue"],
      [100, "Game 1: 10 red, 5 green, 2 blue"],
      [0, "Game 1: 0 blue"],
      [0, "Game 1: "],
    ])("returns %p when %p", (expected, input) => {
      cubeConundrumPart2(input).should.equal(expected);
    });
  });
});
