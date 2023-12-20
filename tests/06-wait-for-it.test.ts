import "chai/register-should";
import { config } from "chai";
import { readFileSync } from "fs";
import { describe, it } from "@jest/globals";
import { calculateInterval, waitForIt } from "../src/06-wait-for-it";

config.truncateThreshold = 0;

describe("calculateInterval", () => {
  it.each([
    [[2, 5], 7, 9],
    [[4, 11], 15, 40],
    [[11, 19], 30, 200],
  ])("returns %p when t_race = %p, d_win = %p", (expected, t_race, d_win) => {
    calculateInterval(t_race, d_win).should.deep.equal(expected);
  });
});

describe("waitForIt", () => {
  describe("given single game", () => {
    it.each([[4, 7, 9]])(
      "returns %p when t_race = %p and d_win = %p",
      (expected, t_race, d_win) => {
        const input = `Time:      ${t_race}
Distance:  ${d_win}`;
        waitForIt(input).should.equal(expected);
      },
    );
  });

  describe("given puzzle description input", () => {
    it.each([[288]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/06-wait-for-it-from-puzzle-description.txt",
        "utf-8",
      );
      waitForIt(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[861300]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/06-wait-for-it.txt", "utf-8");
      waitForIt(input).should.equal(expected);
    });
  });
});
