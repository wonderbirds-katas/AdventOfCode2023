import "chai/register-should";
import { config } from "chai";
import { templateFunction } from "../src/template";
import { readFileSync } from "fs";
import { beforeAll, describe, it } from "@jest/globals";
import { configure } from "approvals";
import { JestReporter } from "approvals/lib/Providers/Jest/JestReporter";
import { verify } from "approvals/lib/Providers/Jest/JestApprovals";

config.truncateThreshold = 0;

describe("templateFunction", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      templateFunction(input).should.equal(expected);
    });
  });

  describe("given puzzle description input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync(
        "./inputs/template-from-puzzle-description.txt",
        "utf-8",
      );
      templateFunction(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/template.txt", "utf-8");
      templateFunction(input).should.equal(expected);
    });
  });
});

describe("templateFunction approval tests", () => {
  beforeAll(() => {
    configure({
      reporters: [new JestReporter()],
    });
  });
  it("HelloApprovals", () => {
    verify("Hello from Approvals");
  });
});
