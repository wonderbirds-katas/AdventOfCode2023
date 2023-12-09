import "chai/register-should";
import { config } from "chai";
import {
  Coordinate,
  expandPartNumbers,
  gearRatios,
  RecordLocationsInStringMatrices,
  Schematic,
  SnapshotRecorder,
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

describe("approvals", () => {
  let snapshotRecorder: SnapshotRecorder;

  const input = readFileSync("./inputs/gearRatios_approvals.txt", "utf-8");

  beforeAll(() => {
    configure({
      reporters: [new JestReporter()],
    });

    snapshotRecorder = new RecordLocationsInStringMatrices(5, 9);
  });

  it("parse symbols", () => {
    gearRatios(input, snapshotRecorder);
    verify(snapshotRecorder.symbols);
  });

  it("locate part number digits", () => {
    gearRatios(input, snapshotRecorder);
    verify(snapshotRecorder.partNumberDigits);
  });
});

describe("parseSymbols", () => {
  describe("given single symbol in single row", () => {
    it("returns empty list of symbols when empty input", () => {
      const input: string = "";
      const actual: Coordinate[] = new Schematic(input).parseSymbols();
      const expected: Coordinate[] = [];
      actual.should.deep.equal(expected);
    });

    it.each([
      [[new Coordinate(0, 0)], "*"],
      [[new Coordinate(0, 1)], ".*"],
      [[new Coordinate(0, 4)], "....^..."],
    ])("returns %p when %p", (expected: Coordinate[], input: string) => {
      new Schematic(input).parseSymbols().should.deep.equal(expected);
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
    ])("returns %p when %p", (expected: Coordinate[], input: string) => {
      new Schematic(input).parseSymbols().should.deep.equal(expected);
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
    ])("returns %p when %p", (expected, input) => {
      new Schematic(input).parseSymbols().should.deep.equal(expected);
    });
  });
});

describe("locatePartNumberDigits", () => {
  describe("given single symbol in the middle of a 3x3 input", () => {
    it("returns empty list of digits when no part numbers", () => {
      const input: string = "...\n.%.\n...";
      const symbols: Coordinate[] = [new Coordinate(1, 1)];
      const expected: Coordinate[] = [];
      new Schematic(input)
        .locatePartNumberDigits(symbols)
        .should.deep.equal(expected);
    });

    describe("and only one single digit part numbers", () => {
      it.each([
        [[new Coordinate(0, 0)], [new Coordinate(1, 1)], "1..\n.%.\n..."],
        [[new Coordinate(0, 1)], [new Coordinate(1, 1)], ".1.\n.%.\n..."],
        [[new Coordinate(0, 2)], [new Coordinate(1, 1)], "..1\n.%.\n..."],
        [[new Coordinate(1, 0)], [new Coordinate(1, 1)], "...\n1%.\n..."],
        [[new Coordinate(1, 2)], [new Coordinate(1, 1)], "...\n.%1\n..."],
        [[new Coordinate(2, 0)], [new Coordinate(1, 1)], "...\n.%.\n1.."],
        [[new Coordinate(2, 1)], [new Coordinate(1, 1)], "...\n.%.\n.1."],
        [[new Coordinate(2, 2)], [new Coordinate(1, 1)], "...\n.%.\n..1"],
      ])(
        "returns %j when symbol at %j and input is %p",
        (expected, symbols, input) => {
          new Schematic(input)
            .locatePartNumberDigits(symbols)
            .should.deep.equal(expected);
        },
      );
    });

    describe("and multiple single digit part numbers", () => {
      it.each([
        [
          [
            new Coordinate(0, 0),
            new Coordinate(0, 2),
            new Coordinate(1, 0),
            new Coordinate(1, 2),
            new Coordinate(2, 1),
          ],
          [new Coordinate(1, 1)],
          "1.1\n1%1\n.1.",
        ],
      ])(
        "returns %j when symbol at %j and input is %p",
        (expected, symbols, input) => {
          new Schematic(input)
            .locatePartNumberDigits(symbols)
            .should.deep.equal(expected);
        },
      );
    });
  });

  describe("given single symbol anywhere inside an NxN input", () => {
    it.each([
      [
        [new Coordinate(1, 2), new Coordinate(2, 3), new Coordinate(3, 2)],
        [new Coordinate(2, 2)],
        ".1.1.\n..1..\n..%1.\n..1..\n11111",
      ],
    ])(
      "returns %j when symbol at %j and input is %p",
      (expected, symbols, input) => {
        new Schematic(input)
          .locatePartNumberDigits(symbols)
          .should.deep.equal(expected);
      },
    );
  });

  describe("given single symbol at edge of an 3x3 input", () => {
    it.each([
      [[], [new Coordinate(0, 0)], "#..\n...\n..."],
      [[], [new Coordinate(0, 2)], "..#\n...\n..."],
      [[], [new Coordinate(2, 0)], "...\n...\n#.."],
      [[], [new Coordinate(2, 2)], "...\n...\n..#"],
      [
        [new Coordinate(0, 1), new Coordinate(1, 0), new Coordinate(1, 1)],
        [new Coordinate(0, 0)],
        "#1.\n11.\n...",
      ],
      [
        [new Coordinate(1, 1), new Coordinate(1, 2), new Coordinate(2, 1)],
        [new Coordinate(2, 2)],
        "...\n.11\n.1#",
      ],
    ])(
      "returns %j when symbol at %j and input is %p",
      (expected, symbols, input) => {
        new Schematic(input)
          .locatePartNumberDigits(symbols)
          .should.deep.equal(expected);
      },
    );
  });
});

describe("expandPartNumbers", () => {
  describe("given single digit part numbers", () => {
    it.each([
      [[1], [new Coordinate(0, 0)], "1"],
      [
        [1, 2, 3],
        [new Coordinate(0, 2), new Coordinate(1, 0), new Coordinate(2, 0)],
        "..1\n2$.\n3",
      ],
    ])(
      "returns %p when part number digits at %j and input %p",
      (expected, partNumberDigits, input) => {
        const schematic = input.split("\n").map((row) => row.split(""));
        expandPartNumbers(schematic, partNumberDigits).should.deep.equal(
          expected,
        );
      },
    );
  });

  describe("given left digits of part number", () => {
    it.each([
      [[42], [new Coordinate(0, 1)], ".42\n%..\n..."],
      [
        [42, 12],
        [new Coordinate(0, 2), new Coordinate(1, 2)],
        "..42\n.%12\n...",
      ],
    ])(
      "returns %p when part number digits at %j and input %p",
      (expected, partNumberDigits, input) => {
        const schematic = input.split("\n").map((row) => row.split(""));
        expandPartNumbers(schematic, partNumberDigits).should.deep.equal(
          expected,
        );
      },
    );
  });

  describe("given ", () => {
    xit.each([
      [[42], [new Coordinate(0, 1)], ".42\n%..\n..."],
      [
        [42, 42, 12, 987, 987, 987],
        [
          new Coordinate(0, 1),
          new Coordinate(0, 1),
          new Coordinate(0, 1),
          new Coordinate(0, 1),
          new Coordinate(0, 1),
        ],
        "..42\n.%12\n987",
      ],
    ])(
      "returns %p when part number digits at %j and input %p",
      (expected, partNumberDigits, input) => {
        const schematic = input.split("\n").map((row) => row.split(""));
        expandPartNumbers(schematic, partNumberDigits).should.deep.equal(
          expected,
        );
      },
    );
  });
});
