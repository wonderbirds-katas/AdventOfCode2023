export function scratchcards(input: string): number {
  return input
    .split("\n")
    .map((_s) => 0)
    .reduce((sum, value) => sum + value, 0);
}
