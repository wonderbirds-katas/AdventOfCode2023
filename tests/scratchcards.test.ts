import "chai/register-should";
import { config } from "chai";
import { scratchcards } from "../src/scratchcards";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("scratchcards", () => {
  describe("GIVEN single card with one winning number", () => {
    describe("WHEN I have a single non-winning number", () => {
      it.each([[0, "Card 1: 0 | 1"]])(
        "THEN returns %d for %p",
        (expected, input) => {
          scratchcards(input).should.equal(expected);
        },
      );
    });

    describe("WHEN I have the same winning number multiple times", () => {
      it.each([
        [1, "Card 1: 0 | 0"],
        [2, "Card 1: 0 | 0 0"],
        [16, "Card 1: 17 | 17 17 17 17 17"],
      ])("THEN returns %d for %p", (expected, input) => {
        scratchcards(input).should.equal(expected);
      });
    });
  });

  describe("GIVEN single card with arbitrary winning numbers", () => {
    describe("WHEN I have an arbitrary sequence of numbers", () => {
      it.each([
        [0, "Card 1: 1 2 3 4 5 | 0"],
        [1, "Card 1: 1 2 3 4 5 | 0 1"],
        [2, "Card 1: 2 42 8711 | 0 1 2 3 4 42"],
      ])("THEN returns %d for %p", (expected, input) => {
        scratchcards(input).should.equal(expected);
      });
    });
  });

  describe("GIVEN multiple cards with single winning number", () => {
    describe("WHEN I only have single non-winning numbers", () => {
      it.each([
        [
          0,
          `Card 1: 0 | 1
Card 2: 0 | 1
Card 3: 0 | 1`,
        ],
      ])("THEN returns %d for %p", (expected, input) => {
        scratchcards(input).should.equal(expected);
      });
    });
  });

  describe("GIVEN example puzzle input", () => {
    it.each([[13]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/scratchcards_from_puzzle_description.txt",
        "utf-8",
      );
      scratchcards(input).should.equal(expected);
    });
  });

  xdescribe("GIVEN my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/scratchcards.txt", "utf-8");
      scratchcards(input).should.equal(expected);
    });
  });
});