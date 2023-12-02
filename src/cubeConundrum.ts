// Part 1 - Understanding the problem
// ==================================
//
// cubes are either red, green or blue
// of each color a random number of cubes is in the bag
// a game is made of a series of drawing a set from the bag
// right after a set of cubes was shown, it is put back before the next set is drawn
//
// Identify the games that are possible given a number of blue, red and green cubes in the bag.
//
// Tests from the problem description
//
// !!!
// !!! Assuming the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes
// !!!
//
// true  -> Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// true  -> Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// false -> Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// false -> Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// true  -> Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
//
// Format of input:
//
// Game ID: 1st set drawn from bag and returned; 2nd set; 3rd set
//
// Solution approach
// -----------------
//
// for every row:
//   sum += isGamePossible ? gameId : 0
//
// gameId = regex parser to find the number after "Game " and before the ":"
//
// isGamePossible:
//   result = true
//   for every set:
//     result = result && isSetPossible
//
// isSetPossible:
//   identify number of red cubes
//   check whether number smaller than limit
//   identify number of green cubes
//   check whether number smaller than limit
//   identify number of blue cubes
//   check whether number smaller than limit
//
// Inside out approach:
//
// Start with tests for identifying the number of cubes of a color
// Go to the next color
// Go to the next color
//
// Go to isSetPossible
//
// Go to isGamePossible
//
// Part 2 - Understanding the problem
// ==================================
//
// ... list some simple tests showing how I understand the puzzle ...
//
// Tests from the problem description
//
// ... copy tests from problme description ...
//
// Solution approach
// -----------------
//
// ... describe solution and algorithm idea roughly ...
//
export function cubeConundrum(input: string): number {
  return 0;
}

export function cubesIn(set: string, color: string) {
  const cubeStringsByColor = set.split(", ");
  for (const cubeString of cubeStringsByColor) {
    const indexOfColor = cubeString.indexOf(color);
    if (indexOfColor == -1) {
      continue;
    }
    const numberAsStr = cubeString.substring(0, indexOfColor);
    return Number(numberAsStr);
  }
  return 0;
}
