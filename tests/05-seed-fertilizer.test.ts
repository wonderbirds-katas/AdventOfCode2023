import "chai/register-should";
import { config } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import {
  Seed,
  seedGenerator,
  partition,
  seedLocation,
  seedLocationPart2,
  seedLocationPart2Parallel,
} from "../src/05-seed-fertilizer";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("seedLocation", () => {
  describe("given all maps are empty", () => {
    it.each([
      [
        0,
        0,
        `seeds: 0

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
        `seeds: 1

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
        `seeds: 7

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
        `seeds: 42

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
        `seeds: 100

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
        `seeds: 1 2 3

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
        `seeds: 3 2 1

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
        `seeds: 3 22 1 14 7 2

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
        `seeds: 100

seed-to-soil map:
42 100 1

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
      [
        42,
        "seed number is end of first range",
        `seeds: 100

seed-to-soil map:
40 98 3

soil-to-fertilizer map:

fertilizer-to-water map:

water-to-light map:

light-to-temperature map:

temperature-to-humidity map:

humidity-to-location map:`,
      ],
      [
        42,
        "seed number is start of last range",
        `seeds: 100

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
        `seeds: 100

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

  describe("given value not contained in map", () => {
    it.each([
      [
        1,
        `seeds: 1

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

  describe("given my personal puzzle input", () => {
    it.each([
      [35, "05-seed-fertilizer-from-puzzle-description.txt"],
      [318728750, "05-seed-fertilizer.txt"],
    ])("returns %p for file %p", (expected, path) => {
      const input = readFileSync(`./inputs/${path}`, "utf-8");
      seedLocation(input).should.equal(expected);
    });
  });
});

describe("seedGenerator", () => {
  it.each([
    [[new Seed(1)], ["seeds: 1 1"]],
    [
      [new Seed(10), new Seed(11), new Seed(20), new Seed(21), new Seed(23)],
      ["seeds: 10 2 20 3"],
    ],
  ])("returns %p for %p", (expected, input) => {
    [...seedGenerator(input)].should.deep.equal(expected);
  });
});

describe("seedGenerators", () => {
  it.each([
    [
      [
        [new Seed(10), new Seed(11)],
        [new Seed(20), new Seed(21), new Seed(23)],
      ],
      ["seeds: 10 2 20 3"],
    ],
  ])("returns %p for %p", (expected, input) => {
    const actual = partition(input);
    actual.length.should.be.equal(expected.length);
    for (let index = 0; index < actual.length; index++) {
      [...actual[index]].should.deep.equal(expected[index]);
    }
  });
});

describe("seedLocationPart2", () => {
  describe("given my personal puzzle input", () => {
    it.each([
      [46, "05-seed-fertilizer-from-puzzle-description.txt"],
      //[37384986, "05-seed-fertilizer.txt"],
    ])("returns %p for file %p", (expected, path) => {
      const input = readFileSync(`./inputs/${path}`, "utf-8");
      seedLocationPart2(input).should.equal(expected);
    });
  });
});

describe("seedLocationPart2Parallel", () => {
  describe("given my personal puzzle input", () => {
    it.each([
      [46, "05-seed-fertilizer-from-puzzle-description.txt"],
      //[37384986, "05-seed-fertilizer.txt"],
    ])("returns %p for file %p", async (expected, path) => {
      const input = readFileSync(`./inputs/${path}`, "utf-8");
      await seedLocationPart2Parallel(input).should.eventually.equal(expected);
    });
  });
});
