export function scratchcards(input: string): number {
  return input.split("\n").map(calculateValueOf).reduce(sum);
}

// Test cases:
// 0 | 1 -> 0
// 0 | 0 -> 1
// 1 | 1 -> 1
// 0 1 | 0 -> 1
// 0 1 | 1 -> 1
// ...
// 0 1 2 3 | 1 1 1 1 1 -> 2^(5-1) = 16
function calculateValueOf(_scratchcard: string) {
  let winningCards = parseWinningCards(_scratchcard);
  let myCards = parseMyCards(_scratchcard);
  let numberOfMatches = countMatchesOf(myCards, winningCards);
  return numberOfMatches > 0 ? /* Math.pow(2, numberOfMatches - 1) */ 0 : 0;
}

function parseWinningCards(_scratchcard: string) {
  return [0];
}

function parseMyCards(_scratchcard: string) {
  return [0];
}

function countMatchesOf(my_cards: number[], in_winning_cards: number[]) {
  return 0;
}

const sum = (a: number, b: number) => a + b;
