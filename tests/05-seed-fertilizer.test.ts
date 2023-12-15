import "chai/register-should";
import { config } from "chai";
import { seedLocation } from "../src/05-seed-fertilizer";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("seedLocation", () => {
  describe("given all maps are empty", () => {
    it.each([
      [
        0,
        0,
        `0

seed-to-soil map:

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
      [
        1,
        1,
        `1

seed-to-soil map:

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
      [
        7,
        7,
        `7

seed-to-soil map:

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
      [
        42,
        42,
        `42

seed-to-soil map:

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
      [
        100,
        100,
        `100

seed-to-soil map:

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
    ])("returns %p when seed number %p", (expected, _seed, input) => {
      seedLocation(input).should.equal(expected);
    });
  });

  xdescribe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/05-seed-fertilizer.txt", "utf-8");
      seedLocation(input).should.equal(expected);
    });
  });
});
