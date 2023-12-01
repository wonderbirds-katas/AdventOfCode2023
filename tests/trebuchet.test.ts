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
