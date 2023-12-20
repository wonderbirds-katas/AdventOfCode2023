// Part 1 - Understanding the problem
// ==================================
//
// Find the number integers in the interval of winning press durations
// The travelled distance must be greater than the maximum winning distance from the last races
//
// From the inputs:
//   t_race = duration of the race in milliseconds
//   d_win = maximum winning distance from previous races
//
// From maths:
//   d = - t_press ^ 2 + t_press * t_race
//
// Tests from the problem description
//
// ... copy tests from problem description ...
//
// Solution approach
// -----------------
//
// For each game:
//
// Find the left and right boundaries of the interval of t_press times allowing you to win
// This is done by finding the zero transitions of the formula d - d_win = 0 using the p-q formula:
// (Note: I did the maths on a sheet of paper)
//
// t_press_lower = Math.ceil(t_race / 2 - sqrt( ( t_race / 2 ) ^ 2 - d_win )
// t_press_upper = Math.ceil(t_race / 2 - sqrt( ( t_race / 2 ) ^ 2 - d_win )
//
// winning_possibilities = t_press_upper - p_press_lower + 1
//
// Finally, multiply the winning_possibilities of each game
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
export function waitForIt(input: string): number {
  return 0;
}
