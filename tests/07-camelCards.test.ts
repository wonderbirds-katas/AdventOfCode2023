import "chai/register-should";
import { config } from "chai";
import {
  camelCards,
  camelCardsPart2,
  CardPart1,
  CardPart2,
  Hand,
  HandPart2,
} from "../src/07-camelCards";
import { readFileSync } from "fs";
import { describe, it } from "@jest/globals";

config.truncateThreshold = 0;

describe("camelCards", () => {
  describe("given single 'high card' hand", () => {
    it.each([
      [0, "98K24 0"],
      [1, "98K24 1"],
      [42, "98K24 42"],
    ])("returns %p when %p", (expected, input) => {
      camelCards(input).should.equal(expected);
    });
  });

  describe("given a sequence of 'high card' hands in ascending order", () => {
    it.each([
      [
        1 * 1 + 2 * 2,
        `98K24 1
J8K24 2`,
      ],
      [
        1 * 1 + 2 * 2 + 3 * 42 + 4 * 999,
        `78K24 1
89K24 2
J8K24 42
K8K24 999`,
      ],
    ])("returns %p when %p", (expected, input) => {
      camelCards(input).should.equal(expected);
    });
  });

  describe("given a sequence of 'high card' hands in random order", () => {
    describe("and first card is different", () => {
      it.each([
        [
          1 * 10 + 2 * 1,
          `78K24 1
58K24 10`,
        ],
      ])("returns %p when %p", (expected, input) => {
        camelCards(input).should.equal(expected);
      });
    });
    describe("and second card is different", () => {
      it.each([
        [
          1 * 10 + 2 * 1,
          `58K24 1
57K24 10`,
        ],
      ])("returns %p when %p", (expected, input) => {
        camelCards(input).should.equal(expected);
      });
    });
    describe("and last card is different", () => {
      it.each([
        [
          1 * 10 + 2 * 1,
          `58K27 1
58K24 10`,
        ],
      ])("returns %p when %p", (expected, input) => {
        camelCards(input).should.equal(expected);
      });
    });
  });

  describe("given hands of different types", () => {
    it.each([
      [
        "high card, one pair",
        1 * 1 + 2 * 10,
        `78K24 1
33K24 10`,
      ],
    ])("when %p", (_description, expected, input) => {
      camelCards(input).should.equal(expected);
    });
  });

  describe("given puzzle description input", () => {
    it.each([[6440]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/07-camelCards-from-puzzle-description.txt",
        "utf-8",
      );
      camelCards(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[241344943]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/07-camelCards.txt", "utf-8");
      camelCards(input).should.equal(expected);
    });
  });
});

describe("calculateValueOfHandType", () => {
  it.each([
    ["high card", 0, "2457K"],
    ["one pair", 1, "22345"],
    ["two pair", 2, "22335"],
    ["three of a kind", 3, "22235"],
    ["full house", 4, "ATAAT"],
    ["full house", 4, "22233"],
    ["four of a kind", 5, "22223"],
    ["five of a kind", 6, "22222"],
  ])("%s => %p when input %p", (_description, expected, cardString) => {
    const cards = cardString.split("").map((c) => new CardPart1(c));
    const hand = new Hand(cards, 0);
    hand.calculateValueOfHandType().should.be.equal(expected);
  });
});

describe("camelCardsPart2", () => {
  describe("given a sequence of 'high card' hands including a Joker", () => {
    it.each([
      [
        1 * 10 + 2 * 1,
        `78K24 1
J8K24 10`,
      ],
    ])("returns %p when %p", (expected, input) => {
      camelCardsPart2(input).should.equal(expected);
    });
  });
  describe("given puzzle description input", () => {
    it.each([[6440]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/07-camelCards-from-puzzle-description.txt",
        "utf-8",
      );
      camelCardsPart2(input).should.equal(expected);
    });
  });
});

describe("calculateValueOfHandType with Jokers for part 2", () => {
  it.each([
    ["high card", 0, "2457K"],
    ["one pair", 1, "2345J"],
    ["three of a kind", 3, "223J5"],
    ["three of a kind", 3, "2J3J5"],
    ["full house", 4, "ATATJ"],
    ["full house", 4, "223J3"],
    ["four of a kind", 5, "22J23"],
    ["four of a kind", 5, "J2J23"],
    ["four of a kind", 5, "J2JJ3"],
    ["five of a kind", 6, "22J2J"],
    ["five of a kind", 6, "J2J2J"],
    ["five of a kind", 6, "J2JJJ"],
    ["five of a kind", 6, "JJJJJ"],
  ])("%s => %p when input %p", (_description, expected, cardString) => {
    const cards = cardString.split("").map((c) => new CardPart2(c));
    const hand = new HandPart2(cards, 0);
    hand.calculateValueOfHandType().should.be.equal(expected);
  });
});
