import "chai/register-should";
import { config } from "chai";
import { cubeConundrum, cubesIn } from "../src/cubeConundrum";
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
});

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
