export function scratchcardsPart2(input: string): number {
  const scratchcards = parseScratchcards(input);
  const numberOfCardsPerIndex = Array(scratchcards.length).fill(1);

  for (let index = 0; index < scratchcards.length; index++) {
    const scratchcard = scratchcards[index];
    const value = calculateValueOf(scratchcard);
    const multiples = numberOfCardsPerIndex[index];

    for (
      let indexOfWonCard = index + 1;
      indexOfWonCard < index + 1 + value;
      indexOfWonCard++
    ) {
      numberOfCardsPerIndex[indexOfWonCard] += multiples;
    }
  }

  return numberOfCardsPerIndex.reduce(sum);
}

export function scratchcards(input: string): number {
  const scratchcards = parseScratchcards(input);
  return scratchcards.map(calculateValueOf).reduce(sum);
}

function parseScratchcards(input: string) {
  const inputWithSingleNumberSeparator = input.replaceAll(/ +/g, " ");
  const scratchcards = inputWithSingleNumberSeparator.split("\n");
  return scratchcards;
}

function calculateValueOf(scratchcard: string) {
  let winningNumbers = parseWinningNumbers(scratchcard);
  let myNumbers = parseMyNumbers(scratchcard);
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
