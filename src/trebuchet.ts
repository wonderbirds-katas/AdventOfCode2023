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
export function trebuchet(input: string): number {
  let sum = 0;

  const rows = input.split("\n");

  for (const row of rows) {
    const onlyNumbers = row.split("").filter((c) => !isNaN(Number(c)));
    const first = onlyNumbers[0];
    const last = onlyNumbers[onlyNumbers.length - 1];
    const recoveredValue = first + last;
    sum += Number(recoveredValue);
  }

  return sum;
}
