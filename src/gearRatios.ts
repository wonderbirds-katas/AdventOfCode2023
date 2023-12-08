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
//   mergeAdjacentPartNumbers:
//     for each digit coordinate:
//       remove all digits right next to that coordinate
//
//   locatePartNumbers:
//     for each digit adjacent to a symbol
//       identify leftmost digit coordinate
//
//   parsePartNumbers__nameIsUsedBySurroundingFunction:
//     for partNumber:
//       identify partNumber length
//       parse partNumber value
//
//     for debugging: create a boolean matrix showing where a part number is located in the schematic
//
//   parsePartNumberValues:
//     for each partNumber:
//       parse value of the digit
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
  approvalTestPrinter: ApprovalTestPrinter = new ApprovalTestPrinter(),
): number {
  if (input === "") {
    return 0;
  }

  const schematic = input.split("\n").map((row) => row.split(""));
  const rows = schematic.length;
  const cols = schematic.length === 0 ? 0 : schematic[0].length;

  const symbols = parseSymbols(input);
  approvalTestPrinter.printParsed(symbols, rows, cols);

  const partNumberDigits = locatePartNumberDigits(input, symbols);
  approvalTestPrinter.printLocatedPartNumberDigits(
    partNumberDigits,
    rows,
    cols,
  );
  return 0;
}

export class Coordinate {
  constructor(
    readonly row: number,
    readonly column: number,
  ) {}
}

function isSymbol(candidate: string) {
  return candidate !== "." && isNaN(Number(candidate));
}

export function parseSymbols(input: string): Coordinate[] {
  const result: Coordinate[] = [];
  const rows = input.split("\n");

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const candidate = row[columnIndex];
      if (isSymbol(candidate)) {
        result.push(new Coordinate(rowIndex, columnIndex));
      }
    }
  }

  return result;
}

export function locatePartNumberDigits(
  input: string,
  symbols: Coordinate[],
): Coordinate[] {
  let result: Coordinate[] = [];
  const rows = input.split("\n");

  for (const symbol of symbols) {
    const minRow = Math.max(0, symbol.row - 1);
    const maxRow = Math.min(rows.length - 1, symbol.row + 1);

    for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
      const row = rows[rowIndex];
      const rowLength = row.length;

      const minColumn = Math.max(0, symbol.column - 1);
      const maxColumn = Math.min(rowLength, symbol.column + 1);

      for (
        let columnIndex = minColumn;
        columnIndex <= maxColumn;
        columnIndex++
      ) {
        const candidate = row[columnIndex];
        if (!isNaN(Number(candidate))) {
          result.push(new Coordinate(rowIndex, columnIndex));
        }
      }
    }
  }
  return result;
}

export class ApprovalTestPrinter {
  parsedSymbols: string = "";
  locatedPartNumberDigits: string = "";

  public printParsed(symbols: Coordinate[], rows: number, columns: number) {
    let parsedSymbolsMatrix: boolean[][] = new Array(rows)
      .fill([])
      .map(() => new Array(columns).fill(false));

    for (const symbol of symbols) {
      parsedSymbolsMatrix[symbol.row][symbol.column] = true;
    }

    this.parsedSymbols = this.printBooleanMatrix(parsedSymbolsMatrix);
  }

  public printLocatedPartNumberDigits(
    partNumberDigits: Coordinate[],
    rows: number,
    columns: number,
  ) {
    let partNumberDigitsMatrix: boolean[][] = new Array(rows)
      .fill([])
      .map(() => new Array(columns).fill(false));

    for (const partNumberDigit of partNumberDigits) {
      partNumberDigitsMatrix[partNumberDigit.row][partNumberDigit.column] =
        true;
    }

    this.locatedPartNumberDigits = this.printBooleanMatrix(
      partNumberDigitsMatrix,
    );
  }

  private printBooleanMatrix(booleanMatrix: boolean[][]) {
    let output = "";
    for (const row of booleanMatrix) {
      output += row.map((b) => (b ? "1" : ".")).join("") + "\n";
    }
    return output;
  }
}
