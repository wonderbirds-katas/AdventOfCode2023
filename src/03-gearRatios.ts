// Part 1 - Understanding the problem
// ==================================
//
// What is the sum of all of the part numbers in the engine schematic?
// - add up all the part numbers
// - any number adjacent to a symbol, even diagonally, is a "part number"
// - Periods (.) do not count as a symbol.
//
// Simple tests
//
// empty -> 0
//
// .5* -> 5
//
// .52* -> 52
//
// .52*8 -> 60
//
// .52*8
// .100. -> 160
//
// ....200
// .52*8..
// .100... -> 360
//
// Tests from the problem description
//
// 467..114.. -> 114 is not a part number
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58. -> 58 is not a part number
// ..592.....
// ......755.
// ...$.*....
// .664.598..
//
// Solution approach
// -----------------
//
// symbols = Symbols.parseFrom(schematic): identify the coordinates of the symbols
// parsePartNumbers(schematic, symbols):
//   locatePartNumberDigitsNextToSymbols:
//     for each symbol
//       identify the coordinates of the digits adjacent to the symbol
//       for debugging: create a boolean matrix showing where a symbol is located in the schematic
//
//   expandPartNumbers:
//     for each digit adjacent to a symbol
//       identify leftmost digit coordinate
//       identify partNumber length
//       parse partNumber value
//
//     for debugging: create a matrix showing only valid part numbers in the schematic
//
// remove oubliettes from part numbers
//   (the algorithm above finds multiple instances of the same part number, one for each of its digits
//   next to a symbol)
//
// for each part number
//   add the number to the sum of part numbers
//
// Data structures / objects
// -------------------------
//
// Coordinate = record(row, column)
//   The top left of the schematic has the coordinate (0, 0).
//
// Symbol = Coordinate
// Symbols = Symbol[]
//
// Digit = Coordinate
// Digits = Digit[]
//
// PartNumber = record(leftCoordinate: coordinate, length: number, value: number)
// PartNumbers = PartNumber[]
//
// Part 2 - Understanding the problem
// ==================================
//
// ... list some simple tests showing how I understand the puzzle ...
//
// Tests from the problem description
//
// ... copy tests from problem description ...
//
// Solution approach
// -----------------
//
// ... describe solution and algorithm idea roughly ...
//
export function gearRatios(
  input: string,
  snapshotRecorder: SnapshotRecorder = new IgnoreSnapshots(),
): number {
  if (input === "") {
    return 0;
  }
  const schematic = new Schematic(input);

  const symbols = schematic.parseSymbols();
  const partNumberDigits = schematic.locatePartNumberDigits(symbols);
  const partNumbersWithOubliettes =
    schematic.expandPartNumbers(partNumberDigits);

  // remove oubliettes
  const partNumbers: PartNumber[] = [];
  const processedPartNumberHashes = new Set<number>();
  for (const partNumber of partNumbersWithOubliettes) {
    const hash = partNumber.topLeft.row * 1000 + partNumber.topLeft.column;
    if (!processedPartNumberHashes.has(hash)) {
      processedPartNumberHashes.add(hash);
      partNumbers.push(partNumber);
    }
  }

  const partNumberValues = partNumbers.map((partNumber) => partNumber.value);

  const sumOfPartNumbers = [...partNumberValues].reduce(
    (previous, current) => previous + current,
    0,
  );

  snapshotRecorder.saveSymbols(symbols);
  snapshotRecorder.savePartNumberDigits(partNumberDigits);
  snapshotRecorder.savePartNumbers(partNumbers);

  return sumOfPartNumbers;
}

export class Coordinate {
  constructor(
    readonly row: number,
    readonly column: number,
  ) {}
}

export class PartNumber {
  constructor(
    readonly topLeft: Coordinate,
    readonly value: number,
  ) {}
}

export class Schematic {
  private readonly _schematic: string[][];
  private readonly _rows: number;
  private readonly _columns: number;

  constructor(input: string) {
    this._schematic = input.split("\n").map((row) => row.split(""));
    this._rows = this._schematic.length;
    this._columns = this._schematic[0].length;
  }

  get rows() {
    return this._rows;
  }

  get columns() {
    return this._columns;
  }

  public parseSymbols(): Coordinate[] {
    const result: Coordinate[] = [];

    for (let row = 0; row < this._rows; row++) {
      for (let column = 0; column < this._columns; column++) {
        const candidate = this._schematic[row][column];
        if (isSymbol(candidate)) {
          result.push(new Coordinate(row, column));
        }
      }
    }

    return result;
  }

  public locatePartNumberDigits(symbols: Coordinate[]): Coordinate[] {
    let result: Coordinate[] = [];

    for (const symbol of symbols) {
      const minRow = Math.max(0, symbol.row - 1);
      const maxRow = Math.min(this._rows - 1, symbol.row + 1);

      for (let row = minRow; row <= maxRow; row++) {
        const minColumn = Math.max(0, symbol.column - 1);
        const maxColumn = Math.min(this._columns - 1, symbol.column + 1);

        for (let column = minColumn; column <= maxColumn; column++) {
          const candidate = this._schematic[row][column];
          if (isNumber(candidate)) {
            result.push(new Coordinate(row, column));
          }
        }
      }
    }
    return result;
  }

  public expandPartNumbers(digitCoordinates: Coordinate[]): PartNumber[] {
    let partNumbersWithCoordinates: PartNumber[] = [];

    for (const digitCoordinate of digitCoordinates) {
      let column = digitCoordinate.column;

      // find the leftmost digit of the current part number
      let isDigit = true;
      while (isDigit) {
        column--;
        isDigit =
          column >= 0 && isNumber(this._schematic[digitCoordinate.row][column]);
      }
      column++;

      let partNumberCoordinate = new Coordinate(digitCoordinate.row, column);

      // parse the part number starting from the leftmost digit
      let partNumber = 0;
      let isLastDigitParsed = false;

      do {
        const digitString = this._schematic[digitCoordinate.row][column];

        isLastDigitParsed =
          digitString === undefined || isNaN(Number(digitString));
        if (!isLastDigitParsed) {
          partNumber = partNumber * 10 + Number(digitString);
        }
        column++;
      } while (!isLastDigitParsed);

      partNumbersWithCoordinates.push(
        new PartNumber(partNumberCoordinate, partNumber),
      );
    }
    return partNumbersWithCoordinates;
  }
}

function isSymbol(candidate: string) {
  return candidate !== "." && isNaN(Number(candidate));
}

function isNumber(candidate: string) {
  return !isNaN(Number(candidate));
}

// Capture human-readable text for approval tests
export interface SnapshotRecorder {
  symbols: string;
  partNumberDigits: string;
  partNumbers: string;
  saveSymbols: (symbols: Coordinate[]) => void;
  savePartNumberDigits: (partNumberDigits: Coordinate[]) => void;
  savePartNumbers: (partNumbers: PartNumber[]) => void;
}

// Don't capture but discard all requests - this implementation is used in production
class IgnoreSnapshots implements SnapshotRecorder {
  partNumberDigits: string = "";
  symbols: string = "";
  partNumbers: string = "";

  saveSymbols(_symbols: Coordinate[]): void {}

  savePartNumberDigits(_partNumberDigits: Coordinate[]): void {}

  savePartNumbers(_partNumbers: PartNumber[]): void {}
}
