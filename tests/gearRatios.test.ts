import "chai/register-should";
import { config } from "chai";
import {
  Coordinate,
  Gear,
  gearRatios,
  gearRatiosPart2,
  PartNumber,
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

  describe("given input file", () => {
    it.each([
      [
        123 + 98 + 983 + 12 + 78123,
        "./inputs/gearRatios_approvals_all_unique.txt",
      ],
      [
        123 + 456 + 78 + 23 + 456 + 100 + 200 + 200 + 300,
        "./inputs/gearRatios_approvals_with_duplicates.txt",
      ],
      [4361, "./inputs/gearRatios_from_puzzle_description.txt"],
    ])("returns %p for %p", (expected, path) => {
      const input = readFileSync(path, "utf-8");
      gearRatios(input).should.equal(expected);
    });
  });

  describe("given my personal puzzle input", () => {
    it.each([[532331]])("returns %p", (expected) => {
      const input = readFileSync("./inputs/gearRatios.txt", "utf-8");
      gearRatios(input).should.equal(expected);
    });
  });
});

describe("approvals", () => {
  beforeAll(() => {
    configure({
      reporters: [new JestReporter()],
    });
  });

  function prepareDataSource(path: string): [string, SnapshotRecorder] {
    const input = readFileSync(path, "utf-8");
    const schematic = new Schematic(input);
    const snapshotRecorder = new RecordLocationsInStringMatrices(
      schematic.rows,
      schematic.columns,
    );

    return [input, snapshotRecorder];
  }

  describe("given unique part numbers", () => {
    const inputPath = "./inputs/gearRatios_approvals_all_unique.txt";

    it("parse symbols", () => {
      const [input, snapshotRecorder] = prepareDataSource(inputPath);
      gearRatios(input, snapshotRecorder);
      verify(snapshotRecorder.symbols);
    });

    it("locate part number digits", () => {
      const [input, snapshotRecorder] = prepareDataSource(inputPath);
      gearRatios(input, snapshotRecorder);
      verify(snapshotRecorder.partNumberDigits);
    });
  });

  describe("given puzzle input from description", () => {
    const inputPath = "./inputs/gearRatios_from_puzzle_description.txt";

    it("parse symbols", () => {
      const [input, snapshotRecorder] = prepareDataSource(inputPath);
      gearRatios(input, snapshotRecorder);
      verify(snapshotRecorder.symbols);
    });

    it("locate part number digits", () => {
      const [input, snapshotRecorder] = prepareDataSource(inputPath);
      gearRatios(input, snapshotRecorder);
      verify(snapshotRecorder.partNumberDigits);
    });
  });

  describe("given my personal puzzle input", () => {
    const inputPath = "./inputs/gearRatios.txt";

    it("parse symbols", () => {
      const [input, snapshotRecorder] = prepareDataSource(inputPath);
      gearRatios(input, snapshotRecorder);
      verify(snapshotRecorder.symbols);
    });

    it("locate entire part numbers", () => {
      const [input, snapshotRecorder] = prepareDataSource(inputPath);
      gearRatios(input, snapshotRecorder);
      verify(snapshotRecorder.partNumbers);
    });
  });

  // Capture variable states for approval tests
  class RecordLocationsInStringMatrices implements SnapshotRecorder {
    symbols: string = "";
    partNumberDigits: string = "";
    partNumbers: string = "";

    private _rows: number;
    private _columns: number;

    constructor(rows: number, columns: number) {
      this._rows = rows;
      this._columns = columns;
    }

    public saveSymbols(coordinates: Coordinate[]) {
      let matrix = this.toBooleanMatrix(coordinates);
      this.symbols = this.printBooleanMatrix(matrix);
    }

    public savePartNumberDigits(coordinates: Coordinate[]) {
      let matrix: boolean[][] = this.toBooleanMatrix(coordinates);
      this.partNumberDigits = this.printBooleanMatrix(matrix);
    }

    public savePartNumbers(partNumbers: PartNumber[]) {
      let matrix: string[][] = new Array(this._rows)
        .fill([])
        .map(() => new Array(this._columns).fill("."));

      for (const partNumber of partNumbers) {
        const valueStr = partNumber.value.toString();
        for (let index = 0; index < valueStr.length; index++) {
          matrix[partNumber.topLeft.row][partNumber.topLeft.column + index] =
            valueStr[index];
        }
      }

      this.partNumbers = this.printStringMatrix(matrix);
    }

    private toBooleanMatrix(coordinates: Coordinate[]) {
      let matrix: boolean[][] = new Array(this._rows)
        .fill([])
        .map(() => new Array(this._columns).fill(false));

      for (const coordinate of coordinates) {
        matrix[coordinate.row][coordinate.column] = true;
      }
      return matrix;
    }

    private printBooleanMatrix(booleanMatrix: boolean[][]) {
      let output = "";
      for (const row of booleanMatrix) {
        output += row.map((b) => (b ? "1" : ".")).join("") + "\n";
      }
      return output;
    }

    private printStringMatrix(stringMatrix: string[][]) {
      let output = "";
      for (const row of stringMatrix) {
        for (const character of row) {
          output += character;
        }
        output += "\n";
      }
      return output;
    }
  }
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
        new Schematic(input)
          .expandPartNumbers(partNumberDigits)
          .map((partNumber) => partNumber.value)
          .should.deep.equal(expected);
      },
    );
  });

  describe("given left digits of part number", () => {
    it.each([
      [[42], [new Coordinate(0, 1)], ".42\n%..\n..."],
      [
        [425, 612],
        [new Coordinate(0, 2), new Coordinate(1, 2)],
        "..425\n.%612\n...",
      ],
    ])(
      "returns %p when part number digits at %j and input %p",
      (expected, partNumberDigits, input) => {
        new Schematic(input)
          .expandPartNumbers(partNumberDigits)
          .map((partNumber) => partNumber.value)
          .should.deep.equal(expected);
      },
    );
  });

  describe("given right digits of part number", () => {
    it.each([
      [[123], [new Coordinate(0, 2)], "123.\n...%\n...."],
      [[123], [new Coordinate(1, 2)], "....\n123%\n...."],
      [[123], [new Coordinate(2, 2)], "....\n...%\n123."],
      [
        [123, 456, 789],
        [new Coordinate(0, 2), new Coordinate(1, 2), new Coordinate(2, 2)],
        "123.\n456%\n789.",
      ],
    ])(
      "returns %p when part number digits at %j and input %p",
      (expected, partNumberDigits, input) => {
        new Schematic(input)
          .expandPartNumbers(partNumberDigits)
          .map((partNumber) => partNumber.value)
          .should.deep.equal(expected);
      },
    );
  });

  describe("given part numbers at arbitrary locations", () => {
    it.each([
      [
        [12345, 12345, 12345, 67, 89, 876, 876],
        [
          new Coordinate(1, 1),
          new Coordinate(1, 2),
          new Coordinate(1, 3),
          new Coordinate(2, 1),
          new Coordinate(2, 3),
          new Coordinate(3, 1),
          new Coordinate(3, 2),
        ],
        `.....
12345
67=89
876..
.....
.....`,
      ],
    ])(
      "returns %p when part number digits at %j and input %p",
      (expected, partNumberDigits, input) => {
        new Schematic(input)
          .expandPartNumbers(partNumberDigits)
          .map((partNumber) => partNumber.value)
          .should.deep.equal(expected);
      },
    );
  });
});

describe("gearRatiosPart2", () => {
  describe("given a single gear", () => {
    it.each([
      [6, 2, 3],
      [20, 4, 5],
    ])(
      "returns %p when factor1 = %p and factor2 = %p",
      (expected, factor1, factor2) => {
        let input = `${factor1}..\n.*.\n..${factor2}`;
        gearRatiosPart2(input).should.deep.equal(expected);
      },
    );
  });
});

describe("findGears", () => {
  describe("given a single gear and single digit part numbers", () => {
    it.each([
      [
        "2..\n.*.\n..3",
        new Gear(
          new Coordinate(1, 1),
          new PartNumber(new Coordinate(0, 0), 2),
          new PartNumber(new Coordinate(2, 2), 3),
        ),
      ],
      [
        "4..\n.*.\n..5",
        new Gear(
          new Coordinate(1, 1),
          new PartNumber(new Coordinate(0, 0), 4),
          new PartNumber(new Coordinate(2, 2), 5),
        ),
      ],
      [
        "...\n3*7\n...",
        new Gear(
          new Coordinate(1, 1),
          new PartNumber(new Coordinate(1, 0), 3),
          new PartNumber(new Coordinate(1, 2), 7),
        ),
      ],
      [
        ".8.\n.*\n9..",
        new Gear(
          new Coordinate(1, 1),
          new PartNumber(new Coordinate(0, 1), 8),
          new PartNumber(new Coordinate(2, 0), 9),
        ),
      ],
    ])("%p => %j", (input, expected) => {
      new Schematic(input).findGears().should.deep.equal([expected]);
    });
  });

  describe("given a single gear and multi-digit part numbers", () => {
    it.each([
      [
        "21.\n.*.\n..3",
        new Gear(
          new Coordinate(1, 1),
          new PartNumber(new Coordinate(0, 0), 21),
          new PartNumber(new Coordinate(2, 2), 3),
        ),
      ],
      [
        "819\n.*.\n.23",
        new Gear(
          new Coordinate(1, 1),
          new PartNumber(new Coordinate(0, 0), 819),
          new PartNumber(new Coordinate(2, 1), 23),
        ),
      ],
      [
        "..819..\n451*...\n.......",
        new Gear(
          new Coordinate(1, 3),
          new PartNumber(new Coordinate(0, 2), 819),
          new PartNumber(new Coordinate(1, 0), 451),
        ),
      ],
      [
        ".819.....\n....*....\n....98765",
        new Gear(
          new Coordinate(1, 4),
          new PartNumber(new Coordinate(0, 1), 819),
          new PartNumber(new Coordinate(2, 4), 98765),
        ),
      ],
    ])("%p => %j", (input, expected) => {
      new Schematic(input).findGears().should.deep.equal([expected]);
    });
  });

  describe("given single gear edge cases", () => {
    it.each([
      ["returns [] when no part number", "...\n.*.\n..."],
      ["returns [] when only a single part number", "21.\n.*.\n..."],
      ["returns [] when too many part numbers", "21.\n7*.\n..9"],
    ])("%s", (_description, input) => {
      new Schematic(input).findGears().should.deep.equal([]);
    });
  });

  describe("given multiple gears with non-overlapping part numbers", () => {
    it.each([
      [
        "two non-overlapping gears",
        `.........
.1.3.....
.*.*.....
.2.4.....`,
        [
          new Gear(
            new Coordinate(2, 1),
            new PartNumber(new Coordinate(1, 1), 1),
            new PartNumber(new Coordinate(3, 1), 2),
          ),
          new Gear(
            new Coordinate(2, 3),
            new PartNumber(new Coordinate(1, 3), 3),
            new PartNumber(new Coordinate(3, 3), 4),
          ),
        ],
      ],
      [
        "two overlapping gears",
        `.........
.1.3.....
.*2*.....
.........`,
        [
          new Gear(
            new Coordinate(2, 1),
            new PartNumber(new Coordinate(1, 1), 1),
            new PartNumber(new Coordinate(2, 2), 2),
          ),
          new Gear(
            new Coordinate(2, 3),
            new PartNumber(new Coordinate(1, 3), 3),
            new PartNumber(new Coordinate(2, 2), 2),
          ),
        ],
      ],
      [
        "two overlapping gears and one non-gear",
        `.........
.1....4..
.*2*3*...
......5..`,
        [
          new Gear(
            new Coordinate(2, 1),
            new PartNumber(new Coordinate(1, 1), 1),
            new PartNumber(new Coordinate(2, 2), 2),
          ),
          new Gear(
            new Coordinate(2, 3),
            new PartNumber(new Coordinate(2, 2), 2),
            new PartNumber(new Coordinate(2, 4), 3),
          ),
        ],
      ],
    ])("%p => %j", (_description, input, expected) => {
      new Schematic(input).findGears().should.deep.equal(expected);
    });
  });
});
