export function scratchcards(input: string): number {
  return input.split("\n").map(calculateValueOf).reduce(sum);
}

function calculateValueOf(_scratchcard: string) {
  let winningNumbers = parseWinningNumbers(_scratchcard);
  let myNumbers = parseMyNumbers(_scratchcard);
  let numberOfMatches = countMatchesOf(myNumbers, winningNumbers);
  return numberOfMatches > 0 ? Math.pow(2, numberOfMatches - 1) : 0;
}

function parseWinningNumbers(scratchcard: string) {
  const regex = /:\s*([\d\s]+)\s\|/;
  const allDigitGroupsAsString = scratchcard.match(regex);
  const separatedDigitGroups = allDigitGroupsAsString![1].split(" ");
  return separatedDigitGroups.map((digitGroup) => Number(digitGroup));
}

function parseMyNumbers(scratchcard: string) {
  const regex = /\|\s*([\d\s]+)/;
  const allDigitGroupsAsString = scratchcard.match(regex);
  const separatedDigitGroups = allDigitGroupsAsString![1].split(" ");
  return separatedDigitGroups.map((digitGroup) => Number(digitGroup));
}

function countMatchesOf(myNumbers: number[], winningNumbers: number[]) {
  return myNumbers.filter((myNumber) => winningNumbers.includes(myNumber))
    .length;
}

const sum = (a: number, b: number) => a + b;
