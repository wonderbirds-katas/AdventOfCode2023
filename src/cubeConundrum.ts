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
// Fewest number of cubes to make game possible
//
// Tests from the problem description
//
// 48   -  4 red,  2 green,  6 blue - Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// 12   -  1 red,  3 green,  4 blue - Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// 1560 - 20 red, 13 green,  6 blue - Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// 630  - 14 red,  3 green, 15 blue - Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// 36   -  6 red,  3 green,  2 blue - Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
//
// power = # red * # green * # blue
//
// sum of powers =2286
//
// Solution approach
// -----------------
//
// ... describe solution and algorithm idea roughly ...

//
export function cubeConundrumPart2(input: string): number {
  let sum = 0;

  const sets = getSetsIn(input);
  for (const set of sets) {
    const power = calculatePowerOfSet(set);
    sum += power;
  }

  return sum;
}

function calculatePowerOfSet(set: string) {
  const numberOfRed = Math.max(1, cubesIn(set, "red"));
  const numberOfGreen = Math.max(1, cubesIn(set, "green"));
  const numberOfBlue = Math.max(1, cubesIn(set, "blue"));
  return numberOfRed * numberOfGreen * numberOfBlue;
}

export function cubeConundrum(input: string): number {
  let sum = 0;

  const games = input.split("\n");
  for (const game of games) {
    if (isGamePossible(game)) {
      const gameIdRegex = /Game (\d+):/;
      const gameId = game.match(gameIdRegex);
      sum += Number(gameId![1]);
    }
  }

  return sum;
}

export function isGamePossible(game: string) {
  if (game.length == 0) {
    return false;
  }
  const sets = getSetsIn(game);
  for (const set of sets) {
    if (!isSetPossible(set)) {
      return false;
    }
  }
  return true;
}

function getSetsIn(game: string) {
  const startOfSets = game.indexOf(":");
  const allSets = game.substring(startOfSets + 1);
  const sets = allSets.split(";");
  return sets;
}

export function isSetPossible(set: string) {
  const numberOfRed = cubesIn(set, "red");
  const numberOfGreen = cubesIn(set, "green");
  const numberOfBlue = cubesIn(set, "blue");
  return numberOfRed <= 12 && numberOfGreen <= 13 && numberOfBlue <= 14;
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
