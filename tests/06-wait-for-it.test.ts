import "chai/register-should";
import { config } from "chai";
import { readFileSync } from "fs";
import { describe, it } from "@jest/globals";
import { waitForIt } from "../src/06-wait-for-it";

config.truncateThreshold = 0;

function interval(t_race: number, d_win: number) {
  return [2, 5];
}

describe("interval", () => {
  it.each([[[2, 5], 7, 9]])(
    "returns %p when t_race = %p, d_win = %p",
    (expected, t_race, d_win) => {
      interval(t_race, d_win).should.deep.equal(expected);
    },
  );
});

xdescribe("waitForIt", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      waitForIt(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/waitForIt.txt", "utf-8");
      waitForIt(input).should.equal(expected);
    });
  });
});
