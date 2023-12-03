import "chai/register-should";
import { config } from "chai";
import { template } from "../src/template";
import { readFileSync } from "fs";

config.truncateThreshold = 0;

describe("template", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      template(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/template.txt", "utf-8");
      template(input).should.equal(expected);
    });
  });
});
