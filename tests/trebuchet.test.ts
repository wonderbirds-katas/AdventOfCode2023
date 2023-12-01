import "chai/register-should";
import { config } from "chai";
import { trebuchet } from "../src/trebuchet";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

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
    trebuchet(input).should.equal(53974);
  });
});
