const argv = require("minimist")(process.argv.slice(2));

export const UsageInstructions = `USAGE: ts-node setup-next-day.ts DAY PUZZLENAME

Copy the template files to the next puzzle.

  DAY        is the number of the advent of code day to set up.

  PUZZLENAME is a shorthand inserted into the filename to give a clue about the puzzle topic.`;

export function setupNextDay(
  day: number | undefined,
  puzzleName: string | undefined,
) {
  if (day === undefined || puzzleName === undefined) {
    console.log(UsageInstructions);
    return;
  }

  console.log(`Copying ./src/template.ts to ./src/${day}-${puzzleName}.ts`);
}

setupNextDay(argv._[0], argv._[1]);
