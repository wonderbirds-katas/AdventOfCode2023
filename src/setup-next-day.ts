import * as path from "node:path";
import { copyFileSync } from "node:fs";

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

export const UsageInstructions = `USAGE: ts-node ./setup-next-day.ts DAY PUZZLENAME

Copy the template files to the next puzzle.

  DAY          is the number of the advent of code day to set up.

  PUZZLENAME   is a shorthand inserted into the filename to give a clue about the puzzle topic.`;

export function setupNextDay(
  day: number | undefined,
  puzzleName: string | undefined,
  targetParentDir: string,
  copyCommand: CopyCommand,
) {
  if (day === undefined || puzzleName === undefined) {
    console.log(UsageInstructions);
    return;
  }

  const templateFiles = [
    new TemplateFile("src", "template.ts", day, puzzleName, targetParentDir),
    new TemplateFile(
      "tests",
      "template.test.ts",
      day,
      puzzleName,
      targetParentDir,
      ".test",
    ),
  ];

  for (const templateFile of templateFiles) {
    copyCommand.copy(templateFile.sourcePath, templateFile.destinationPath);
  }
}

// Construct the source and destination paths for a template file
class TemplateFile {
  private readonly _destinationFile: string;

  // folder: path to the folder containing the template and receiving the copy
  // sourceFile: filename of the template
  // day: number of advent of code day
  // puzzleName: short name to distinguish the name of the puzzle
  // suffix: file name suffix to insert between puzzleName and extension
  constructor(
    readonly folder: string,
    readonly sourceFile: string,
    readonly day: number,
    readonly puzzleName: string,
    readonly targetParentDir: string = "",
    readonly suffix: string = "",
  ) {
    const zeroPaddedDay = `${day}`.padStart(2, "0");
    this._destinationFile = `${zeroPaddedDay}-${this.puzzleName}${suffix}.ts`;
  }

  get sourcePath() {
    return path.join(this.folder, this.sourceFile);
  }

  get destinationPath() {
    return path.join(this.targetParentDir, this.folder, this._destinationFile);
  }
}

interface CopyCommand {
  copy(sourcePath: string, destinationPath: string): void;
}

export class UseFsCopyFile {
  copy(sourcePath: string, destinationPath: string): void {
    copyFileSync(sourcePath, destinationPath);
  }
}

setupNextDay(argv._[0], argv._[1], "", new UseFsCopyFile());
