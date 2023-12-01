// Understanding the problem
// =========================
//
// assumption: every row contains 1 or more digits
//
// single digit is duplicated
// 0 -> 00 -> 0
// 1 -> 11
// 2 -> 22
//
// single digit mixed with letters is duplicated
// a0 -> 00
// aa0 -> 00
// same for a1, a2, 1a, 2a, ... a0a, ...
//
// two digits are extracted to 2 digit number
// 01 -> 01
// 02 -> 02 ...
//
// 10 -> 10
// ...
//
// for three or more digits, only the first and the last digits are used
//
// Tests from the problem description
// 1abc2 -> 12
// pqr3stu8vwx -> 38
// a1b2c3d4e5f -> 15
// treb7uchet -> 77
//
// Solution approach
// -----------------
//
// trebuchet = For every row in the input:
//   recover =
//     Remove all letters
//     identify the first digit
//     identify the last digit
//     combine digits to a string
//     convert string to number

// Part 2
// ======
//
// one -> 1
// ...
//
// Update algorithm "recover" by introducing a converter
//
// recover =
//   replace all valid digit names by equivalent digit
//   original recover
//
export function trebuchet(input: string): number {
  const rows = input.split("\n");

  let sum = 0;
  for (const row of rows) {
    sum += recover(row);
  }

  return sum;
}

function recover(row: string) {
  const replacedDigitNames = replaceDigitNamesIn(row);

  const onlyNumbers = replacedDigitNames
    .split("")
    .filter((c) => !isNaN(Number(c)));

  if (onlyNumbers.length <= 0) {
    return 0;
  }

  const first = onlyNumbers[0];
  const last = onlyNumbers[onlyNumbers.length - 1];
  const recoveredDigitPair = first + last;
  return Number(recoveredDigitPair);
}

export function replaceDigitNamesIn(row: string) {
  // identify the first possible name to number replacement

  // replace the number identified first

  // identify the last possible replacement

  // replace

  return row
    .replace("one", "1")
    .replace("two", "2")
    .replace("three", "3")
    .replace("four", "4")
    .replace("five", "5")
    .replace("six", "6")
    .replace("seven", "7")
    .replace("eight", "8")
    .replace("nine", "9")
    .replace("zero", "0");
}
