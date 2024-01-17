import * as path from "node:path";
import { copyFileSync, writeFileSync } from "node:fs";
import { readFileSync } from "fs";

const argv = require("minimist")(process.argv.slice(2));

// prettier-ignore
export const UsageInstructions =
`USAGE: ts-node ./src/setup-next-day.ts DAY PUZZLENAME

Copy the template files to the next puzzle.

  DAY          is the number of the advent of code day to set up.

  PUZZLENAME   is a shorthand inserted into the filename to give a clue about the puzzle topic.`;

export function setupNextDay(
  day: number | undefined,
  puzzleName: string | undefined,
  targetParentDir: string,
  copyCommand: CopyCommand,
  reader: Reader = new FileReader(),
  writer: Writer = new FileWriter(),
) {
  if (day === undefined || puzzleName === undefined) {
    console.log(UsageInstructions);
    return;
  }

  // prettier-ignore
  const templateFiles = [
    new TemplateFile("src", "template.ts", day, puzzleName, targetParentDir),
    new TemplateFile("tests", "template.test.ts", day, puzzleName, targetParentDir, ".test"),
    new TemplateFile("inputs", "template.txt", day, puzzleName, targetParentDir),
    new TemplateFile("inputs", "template-from-puzzle-description.txt", day, puzzleName, targetParentDir, "-from-puzzle-description"),
  ];

  for (const templateFile of templateFiles) {
    copyCommand.copy(templateFile.sourcePath, templateFile.destinationPath);
  }

  for (const templateFile of templateFiles) {
    const originalContents = reader.read(templateFile.destinationPath);
    const moduleName = `${padWithLeadingZero(templateFile.day)}-${
      templateFile.puzzleName
    }`;
    const replacedContents = originalContents
      .replaceAll(/templateFunction/g, templateFile.puzzleName)
      .replaceAll(/template/g, moduleName);
    writer.write(templateFile.destinationPath, replacedContents);
  }
}

// Construct the source and destination paths for a template file
class TemplateFile {
  private readonly _destinationFile: string;

  //          folder: path to the folder containing the template and receiving the copy
  //      sourceFile: filename of the template
  //             day: number of advent of code day
  //      puzzleName: short name to distinguish the name of the puzzle
  // targetParentDir: directory below which the copied files shall be placed.
  //                  Allows integration tests to copy to a temporary directory.
  //          suffix: file name suffix to insert between puzzleName and extension
  constructor(
    readonly folder: string,
    readonly sourceFile: string,
    readonly day: number,
    readonly puzzleName: string,
    readonly targetParentDir: string = "",
    readonly suffix: string = "",
  ) {
    const zeroPaddedDay = padWithLeadingZero(day);

    const extensionStart = sourceFile.lastIndexOf(".");
    const extension =
      extensionStart === -1 ? "" : sourceFile.substring(extensionStart);

    this._destinationFile = `${zeroPaddedDay}-${this.puzzleName}${suffix}${extension}`;
  }

  get sourcePath() {
    return path.join(this.folder, this.sourceFile);
  }

  get destinationPath() {
    return path.join(this.targetParentDir, this.folder, this._destinationFile);
  }
}

function padWithLeadingZero(day: number): string {
  return `${day}`.padStart(2, "0");
}

export interface CopyCommand {
  copy(sourcePath: string, destinationPath: string): void;
}

export class UseFsCopyFile {
  copy(sourcePath: string, destinationPath: string): void {
    copyFileSync(sourcePath, destinationPath);
  }
}

export interface Reader {
  read(filePath: string): string;
}

export class FileReader implements Reader {
  read(filePath: string): string {
    return readFileSync(filePath, {
      encoding: "utf-8",
    });
  }
}

export interface Writer {
  write(filePath: string, text: string): void;
}

export class FileWriter implements Writer {
  write(filePath: string, text: string): void {
    const data = new Uint8Array(Buffer.from(text));
    writeFileSync(filePath, data, {
      encoding: "utf-8",
      flush: true,
    });
  }
}

setupNextDay(argv._[0], argv._[1], "", new UseFsCopyFile());
