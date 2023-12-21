import "chai/register-should";
import { config } from "chai";
import { camelCards } from "../src/07-camelCards";
import { readFileSync } from "fs";
import { describe, it } from "@jest/globals";

config.truncateThreshold = 0;

describe("camelCards", () => {
  describe("given single random hand (high card)", () => {
    it.each([
      [0, "98K24 0"],
      [1, "98K24 1"],
      [42, "98K24 42"],
    ])("returns %p when %p", (expected, input) => {
      camelCards(input).should.equal(expected);
    });
  });

  describe("given a sequence of random hands in ascending order (high card)", () => {
    it.each([
      [
        1 * 1 + 2 * 2,
        `98K24 1
J8K24 2`,
      ],
      [
        1 * 1 + 2 * 2 + 3 * 42 + 4 * 999,
        `78K24 1
88K24 2
J8K24 42
K8K24 999`,
      ],
    ])("returns %p when %p", (expected, input) => {
      camelCards(input).should.equal(expected);
    });
  });

  xdescribe("given puzzle description input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/07-camelCards-from-puzzle-description.txt",
        "utf-8",
      );
      camelCards(input).should.equal(expected);
    });
  });

  xdescribe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/07-camelCards.txt", "utf-8");
      camelCards(input).should.equal(expected);
    });
  });
});
