import "chai/register-should";
import { config } from "chai";
import {
  Coordinate,
  gearRatios,
  locatePartNumberDigitsNextToSymbols,
  parseSymbols,
} from "../src/gearRatios";
import { readFileSync } from "fs";
import { beforeAll, describe, it } from "@jest/globals";
import { JestReporter } from "approvals/lib/Providers/Jest/JestReporter";
import { verify } from "approvals/lib/Providers/Jest/JestApprovals";
import { configure } from "approvals";

config.truncateThreshold = 0;

describe("gearRatios", () => {
  describe("given nothing", () => {
    it.each([[0, ""]])("returns %p when %p", (expected, input) => {
      gearRatios(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[0]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/gearRatios.txt", "utf-8");
      gearRatios(input).should.equal(expected);
    });
  });
});

describe("printBooleanMatrix", () => {
  function printBooleanMatrix(booleanMatrix: boolean[][]) {
    let output = "";
    for (const row of booleanMatrix) {
      output += row.map((b) => (b ? "1" : ".")).join("") + "\n";
    }
    return output;
  }

  beforeAll(() => {
    configure({
      reporters: [new JestReporter()],
    });
  });

  it("should print", () => {
    const booleanMatrix: boolean[][] = [
      [true, false, false, false],
      [false, true, false, false],
      [false, false, true, false],
      [false, false, false, false, false],
      [true, true, true, true, true],
    ];
    verify(printBooleanMatrix(booleanMatrix));
  });
});

describe("parseSymbols", () => {
  describe("given single symbol in single row", () => {
    it("returns empty list of symbols when empty schematic", () => {
      const schematic: string = "";
      const actual: Coordinate[] = parseSymbols(schematic);
      const expected: Coordinate[] = [];
      actual.should.deep.equal(expected);
    });

    it.each([
      [[new Coordinate(0, 0)], "*"],
      [[new Coordinate(0, 1)], ".*"],
      [[new Coordinate(0, 4)], "....^..."],
    ])("returns %p when %p", (expected: Coordinate[], schematic: string) => {
      parseSymbols(schematic).should.deep.equal(expected);
    });
  });

  describe("given multiple symbols in single row", () => {
    it.each([
      [[new Coordinate(0, 0), new Coordinate(0, 1)], "*/"],
      [[new Coordinate(0, 2), new Coordinate(0, 7)], "..(....+."],
      [
        [new Coordinate(0, 1), new Coordinate(0, 3), new Coordinate(0, 5)],
        ".&.*.,...",
      ],
    ])("returns %p when %p", (expected: Coordinate[], schematic: string) => {
      parseSymbols(schematic).should.deep.equal(expected);
    });
  });

  describe("given multiple symbols in multiple rows", () => {
    it.each([
      [[new Coordinate(0, 2), new Coordinate(1, 0)], "..%\n$.."],
      [
        [
          new Coordinate(0, 2),
          new Coordinate(1, 1),
          new Coordinate(2, 0),
          new Coordinate(2, 2),
        ],
        "..%\n.$.\n_.!",
      ],
    ])("returns %p when %p", (expected, schematic) => {
      parseSymbols(schematic).should.deep.equal(expected);
    });
  });
});

describe("locatePartNumberDigitsNextToSymbols", () => {
  describe("given single symbol not at an edge of schematic", () => {
    it("returns empty list of digits when no part numbers", () => {
      const schematic: string = "...\n.%.\n...";
      const symbols: Coordinate[] = [new Coordinate(1, 1)];
      const expected: Coordinate[] = [];
      locatePartNumberDigitsNextToSymbols(schematic, symbols).should.deep.equal(
        expected,
      );
    });

    describe("and only single digit part numbers in row above symbol", () => {
      it.each([
        [[new Coordinate(0, 0)], [new Coordinate(1, 1)], "1..\n.%.\n"],
        [[new Coordinate(0, 1)], [new Coordinate(1, 1)], ".1.\n.%.\n"],
        [[new Coordinate(0, 2)], [new Coordinate(1, 1)], "..1\n.%.\n"],
      ])(
        "returns %j when symbol at %j and schematic is %p",
        (expected, symbols, schematic) => {
          locatePartNumberDigitsNextToSymbols(
            schematic,
            symbols,
          ).should.deep.equal(expected);
        },
      );
    });
  });
});
