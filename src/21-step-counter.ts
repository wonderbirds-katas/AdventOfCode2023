// Part 1 - Understanding the problem
// ==================================
//
// GIVEN a map
// WHEN I walk 64 steps
// THEN I know the number of garden plots I can reach
//
// Tests from the problem description
//
// 'S' -> 1
// 'S.' -> 2
// '.S.' -> 3
//
// '.\n'
// 'S\n'
// '.\n' -> 3
//
// '...\n'
// '.S.\n'
// '...\n' -> 9
//
// Solution approach
// -----------------
//
// Find the coordinate of 'S'
//
// Implement Flood Fill starting at 'S', maxNumberOfSteps:
// For every step:
//   If plot not visited, then increase numberOfPlots
//   Mark visited plot
//   If numberOfSteps = maxNumberOfSteps then return numberOfPlots
//   Increase numberOfSteps
//
// Flood Fill: https://www.enjoyalgorithms.com/blog/flood-fill-problem
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

function countPlotsHelper(
  visitedPlots: boolean[][],
  x: number,
  y: number,
  remainingSteps: number,
  accumulatedNumberOfPlots: number,
): number {
  const mapHeight = visitedPlots.length;
  const mapWidth = visitedPlots[0].length;

  if (remainingSteps < 0 || x >= mapWidth || y >= mapHeight) {
    return accumulatedNumberOfPlots;
  }

  if (!visitedPlots[y][x]) {
    accumulatedNumberOfPlots += 1;
    visitedPlots[y][x] = true;
  }

  remainingSteps -= 1;
  return countPlotsHelper(
    visitedPlots,
    x + 1,
    y,
    remainingSteps,
    accumulatedNumberOfPlots,
  );
}

function countPlots(
  visitedPlots: boolean[][],
  x: number,
  y: number,
  maxSteps: number,
) {
  return countPlotsHelper(visitedPlots, x, y, maxSteps, 0);
}

function createVisitedPlotsMapFor(input: string): boolean[][] {
  const width = input.length - 1;
  const height = 1;
  return new Array(1).fill(false).map(() => new Array(width).fill(false));
}

//
export function stepCounter(input: string): number {
  let visitedPlots = createVisitedPlotsMapFor(input);
  return countPlots(visitedPlots, 0, 0, 64);
}
