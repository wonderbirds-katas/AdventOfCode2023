const argv = require("minimist")(process.argv.slice(2));

// Idea
// ====
//
// WHEN I run ts-node ./setup-next-day.ts 12 example,
// THEN The following files shall be generated from the templates:
// - ./src/12-example.ts
// - ./tests/12-example.test.ts
// - ./inputs/12-example.txt
// - ./inputs/12-example-from-puzzle-description.txt
//
// Solution
// --------
//
// CopyData is a structure of
// - folder: path
// - template: filename
// - destination: filename
//
// Destination file is derived from day and puzzleName arguments using the constructor
//
// For each entry in CopyData:
//   Copy folder/template to folder/destination
//
// Solution approach
// -----------------
//
// Start with printing the instructions instead of copying
// Make the target folder a parameter of the test
// Create temporary directory in the test for an integration test
//

export const UsageInstructions = `USAGE: ts-node setup-next-day.ts DAY PUZZLENAME

Copy the template files to the next puzzle.

  DAY          is the number of the advent of code day to set up.

  PUZZLENAME   is a shorthand inserted into the filename to give a clue about the puzzle topic.`;

export function setupNextDay(
  day: number | undefined,
  puzzleName: string | undefined,
) {
  if (day === undefined || puzzleName === undefined) {
    console.log(UsageInstructions);
    return;
  }

  console.log(`Copy ./src/template.ts to ./src/${day}-${puzzleName}.ts`);
}

setupNextDay(argv._[0], argv._[1]);
