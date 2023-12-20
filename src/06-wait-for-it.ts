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
// t_press_lower = ceil(t_race / 2 - sqrt( ( t_race / 2 ) ^ 2 - d_win )
// t_press_upper = floor(t_race / 2 + sqrt( ( t_race / 2 ) ^ 2 - d_win )
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
type InputRowToNumbers = (input: string, prefix: string) => number[];

export function waitForItPart2(input: string): number {
  return waitForIt(input, inputRowToNumbersPart2);
}

function inputRowToNumbersPart2(row: string, prefix: string) {
  return inputRowToNumbers(row, prefix, false);
}

export function waitForIt(
  input: string,
  customInputRowToNumbers: InputRowToNumbers = inputRowToNumbers,
): number {
  const rows = input.split("\n");
  const times = customInputRowToNumbers(rows[0], "Times:");
  const distances = customInputRowToNumbers(rows[1], "Distance:");

  let result = 1;
  for (let i = 0; i < times.length; i++) {
    const [left, right] = calculateInterval(times[i], distances[i]);
    result *= right - left + 1;
  }

  return result;
}

function inputRowToNumbers(
  row: string,
  prefix: string,
  keepSpaceBetweenNumbers: boolean = true,
) {
  const replacementForSpacesBetweenNumbers = keepSpaceBetweenNumbers ? " " : "";
  return row
    .substring(prefix.length)
    .trim()
    .replaceAll(/\s+/g, replacementForSpacesBetweenNumbers)
    .split(" ")
    .map((s) => Number(s));
}

export function calculateInterval(t_race: number, d_win: number): number[] {
  // find the left root of the distance equation
  let t_press_lower = Math.ceil(
    t_race / 2 - Math.sqrt((t_race / 2) ** 2 - d_win),
  );

  // find the right root of the distance equation
  let t_press_upper = Math.floor(
    t_race / 2 + Math.sqrt((t_race / 2) ** 2 - d_win),
  );

  // correct left interval boundary so that the
  // distance is larger, not equal to the winning distance
  const distance_lower = t_press_lower * (t_race - t_press_lower);
  if (Math.abs(distance_lower - d_win) < Number.EPSILON) {
    t_press_lower += 1;
  }

  // correct right interval boundary so that the
  // distance is larger, not equal to the winning distance
  const distance_upper = t_press_upper * (t_race - t_press_upper);
  if (Math.abs(distance_upper - d_win) < Number.EPSILON) {
    t_press_upper -= 1;
  }

  return [t_press_lower, t_press_upper];
}
