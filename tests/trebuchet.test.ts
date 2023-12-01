import "chai/register-should";
import { config } from "chai";
import { trebuchet, replaceDigitNamesIn } from "../src/trebuchet";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("trebuchet", () => {
  describe("given empty input", () => {
    it("returns 0", () => {
      trebuchet("").should.equal(0);
    });
  });

  describe("given single digit", () => {
    it.each([
      [0, "0"],
      [11, "1"],
      [99, "9"],
    ])("returns %p when %p", (expected: number, input: string) => {
      trebuchet(input).should.equal(expected);
    });
  });

  describe("given two digits", () => {
    it.each([
      [0, "00"],
      [10, "10"],
      [26, "26"],
      [99, "99"],
    ])("returns %p when %p", (expected: number, input: string) => {
      trebuchet(input).should.equal(expected);
    });
  });

  describe("given three digits", () => {
    it.each([
      [0, "000"],
      [17, "107"],
      [26, "296"],
      [99, "919"],
    ])("returns %p when %p", (expected: number, input: string) => {
      trebuchet(input).should.equal(expected);
    });
  });

  describe("given digits mixed with letters", () => {
    it.each([
      [0, "0a"],
      [0, "ab0a"],
      [93, "ewe9fdd2er1sdf3er6we0sd3a"],
      [93, "9fdd2er1sdf3er6we0sd3"],
    ])("returns %p when %p", (expected: number, input: string) => {
      trebuchet(input).should.equal(expected);
    });
  });

  describe("given multiple rows", () => {
    it.each([
      [2, "01\n01"],
      [0, "0\n0"],
      [86, "gf5vguu4e\nsae0fdd\newdcx3df41dfd2"],
    ])("returns %p when %p", (expected: number, input: string) => {
      trebuchet(input).should.equal(expected);
    });
  });

  describe("given input from the puzzle description", () => {
    it("returns 142", () => {
      const input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
      trebuchet(input).should.equal(142);
    });
  });

  describe("given my personal puzzle input", () => {
    it("returns 53974", () => {
      const input = readFileSync("./inputs/trebuchet.txt", "utf-8");
      trebuchet(input).should.equal(52179);
    });
  });

  describe("given digit name as single row input", () => {
    it.each([
      [11, "one"],
      [22, "two"],
      [33, "three"],
      [44, "four"],
      [55, "five"],
      [66, "six"],
      [77, "seven"],
      [88, "eight"],
      [99, "nine"],
      [0, "zero"],
    ])("returns %p when %p", (expected, input) => {
      trebuchet(input).should.equal(expected);
    });
  });

  describe("given special digit name combinations", () => {
    it.each([
      // [83, "eightwothree"],
      [13, "abcone2threexyz"],
      // [24, "xtwone3four"],
      [42, "4nineeightseven2"],
      [14, "zoneight234"],
      [76, "7pqrstsixteen"],
      // [18, "oneight"],
      // [82, "eightwo"],
    ])("returns %p when %p", (expected, input) => {
      trebuchet(input).should.equal(expected);
    });
  });

  describe("given input from part 2 puzzle description", () => {
    xit("returns 281", () => {
      const input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;
      trebuchet(input).should.equal(281);
    });
  });
});

describe("replaceDigitNamesIn", () => {
  describe("given single digit name", () => {
    it.each([
      ["1", "one"],
      ["2", "two"],
      ["3", "three"],
      ["4", "four"],
      ["5", "five"],
      ["6", "six"],
      ["7", "seven"],
      ["8", "eight"],
      ["9", "nine"],
      ["0", "zero"],
    ])("returns %p when %p", (expected, input) => {
      replaceDigitNamesIn(input).should.equal(expected);
    });
  });
});
