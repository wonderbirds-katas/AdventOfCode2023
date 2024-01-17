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
//   If field not visited, then increase numberOfPlots
//   Mark visited fields
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
//
export function stepCounter(input: string): number {
  return 0;
}
