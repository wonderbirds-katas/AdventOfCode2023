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

  describe("given locations are sorted differently", () => {
    it.each([
      [
        1,
        "locations in ascending order",
        `1 2 3

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
        "locations in descending order",
        `3 2 1

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
        "locations in mixed order",
        `3 22 1 14 7 2

seed-to-soil map:

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
    ])("returns %p when %s", (expected, _description, input) => {
      seedLocation(input).should.equal(expected);
    });
  });

  describe("given one map contains a relevant mapping", () => {
    it.each([
      [
        42,
        "seed number is start of first range",
        `100

seed-to-soil map:
42 100 1

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
      /*      [
        42,
        "seed number is end of first range",
        `100

seed-to-soil map:
40 98 3

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
 */
      [
        42,
        "seed number is start of last range",
        `100

seed-to-soil map:
0 90 10
10 20 10
42 100 1

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
    ])("returns %p when %s", (expected, _seed, input) => {
      seedLocation(input).should.equal(expected);
    });
  });

  describe("given multiple maps contain relevant mappings", () => {
    it.each([
      [
        1,
        "seed-to-soil map and soil-to-fertilizer map",
        `100

seed-to-soil map:
42 100 1

soil-to-fertilizer map:
1 42 1

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
    ])("returns %p when %s are applicable", (expected, _seed, input) => {
      seedLocation(input).should.equal(expected);
    });
  });

  xdescribe("given value not contained in map", () => {
    it.each([
      [
        1,
        `1

seed-to-soil map:
42 100 1

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
    ])("returns source value", (expected, input) => {
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
