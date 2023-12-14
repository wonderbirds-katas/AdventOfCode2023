export function scratchcards(input: string): number {
  const inputWithSingleNumberSeparator = input.replaceAll(/ +/g, " ");
  const scratchcards = inputWithSingleNumberSeparator.split("\n");
  return scratchcards.map(calculateValueOf).reduce(sum);
}

function calculateValueOf(scratchcard: string) {
  let winningNumbers = parseWinningNumbers(scratchcard);
  let myNumbers = parseMyNumbers(scratchcard);
  let numberOfMatches = countMatchesOf(myNumbers, winningNumbers);
  return numberOfMatches > 0 ? Math.pow(2, numberOfMatches - 1) : 0;
}

function parseMyNumbers(scratchcard: string) {
  return parsNumbersInGroup(scratchcard, /\|\s*([\d\s]+)/);
}

function parseWinningNumbers(scratchcard: string) {
  return parsNumbersInGroup(scratchcard, /:\s*([\d\s]+)\s\|/);
}

function parsNumbersInGroup(scratchcard: string, groupDefinition: RegExp) {
  const allDigitGroupsAsString = scratchcard.match(groupDefinition);
  const separatedDigitGroups = allDigitGroupsAsString![1].split(" ");
  return separatedDigitGroups.map((digitGroup) => Number(digitGroup));
}

function countMatchesOf(myNumbers: number[], winningNumbers: number[]) {
  return myNumbers.filter((myNumber) => winningNumbers.includes(myNumber))
    .length;
}

const sum = (a: number, b: number) => a + b;
