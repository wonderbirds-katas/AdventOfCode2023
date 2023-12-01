import "chai/register-should";
import { config } from "chai";
import { trebuchet } from "../src/trebuchet";

config.truncateThreshold = 0;

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
