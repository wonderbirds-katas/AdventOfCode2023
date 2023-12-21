import "chai/register-should";
import { config } from "chai";
import { camelCards } from "../src/07-camelCards";
import { readFileSync } from "fs";
import { describe, it } from "@jest/globals";

config.truncateThreshold = 0;

describe("camelCards", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      camelCards(input).should.equal(expected);
    });
  });

  describe("given puzzle description input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/07-camelCards-from-puzzle-description.txt",
        "utf-8",
      );
      camelCards(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/07-camelCards.txt", "utf-8");
      camelCards(input).should.equal(expected);
    });
  });
});
