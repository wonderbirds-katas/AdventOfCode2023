import "chai/register-should";
import { config } from "chai";
import { template } from "../src/template";
import { readFileSync } from "fs";
import { beforeAll, describe, it } from "@jest/globals";
import { configure } from "approvals";
import { JestReporter } from "approvals/lib/Providers/Jest/JestReporter";
import { verify } from "approvals/lib/Providers/Jest/JestApprovals";

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

describe("template approval tests", () => {
  beforeAll(() => {
    configure({
      reporters: [new JestReporter()],
    });
  });
  it("HelloApprovals", () => {
    verify("Hello from Approvals");
  });
});
