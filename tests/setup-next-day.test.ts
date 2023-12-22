import {
  CopyCommand,
  Reader,
  Writer,
  setupNextDay,
  UsageInstructions,
  UseFsCopyFile,
  FileReader,
  FileWriter,
} from "../src/setup-next-day";
import { mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import * as path from "node:path";
import { tmpdir } from "node:os";
import SpyInstance = jest.SpyInstance;
import { readFileSync } from "fs";

describe("setup-next-day should", () => {
  let logSpy: SpyInstance<void, [message?: any, ...any[]], any>;

  beforeEach(() => {
    logSpy = jest.spyOn(global.console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it.each([
    ["src/08-puzzleName.ts", 8, "puzzleName"],
    ["src/12-puzzleName.ts", 12, "puzzleName"],
    ["src/42-puzzleName.ts", 42, "puzzleName"],
    ["src/10-otherName.ts", 10, "otherName"],
  ])("copy src/template.ts to %s", (expected, day, puzzleName) => {
    setupNextDay(
      day,
      puzzleName,
      "",
      new CopyCommandPrinter(),
      new ReturnsEmptyString(),
      new NoAction(),
    );

    expect(logSpy).toHaveBeenCalledWith(`Copy src/template.ts to ${expected}`);
  });

  it.each([
    [
      "/target-parent-dir/src/08-puzzleName.ts",
      8,
      "puzzleName",
      "/target-parent-dir",
    ],
  ])(
    "copy src/template.ts to %s",
    (expected, day, puzzleName, targetParentDir) => {
      setupNextDay(
        day,
        puzzleName,
        targetParentDir,
        new CopyCommandPrinter(),
        new ReturnsEmptyString(),
        new NoAction(),
      );

      expect(logSpy).toHaveBeenCalledWith(
        `Copy src/template.ts to ${expected}`,
      );
    },
  );

  it.each([
    ["tests/08-puzzleName.test.ts", 8, "puzzleName"],
    ["tests/10-otherName.test.ts", 10, "otherName"],
  ])("copy tests/template.test.ts to %s", (expected, day, puzzleName) => {
    setupNextDay(
      day,
      puzzleName,
      "",
      new CopyCommandPrinter(),
      new ReturnsEmptyString(),
      new NoAction(),
    );

    expect(logSpy).toHaveBeenCalledWith(
      `Copy tests/template.test.ts to ${expected}`,
    );
  });

  it.each([["inputs/08-puzzleName.txt", 8, "puzzleName"]])(
    "copy inputs/template.txt to %s",
    (expected, day, puzzleName) => {
      setupNextDay(
        day,
        puzzleName,
        "",
        new CopyCommandPrinter(),
        new ReturnsEmptyString(),
        new NoAction(),
      );

      expect(logSpy).toHaveBeenCalledWith(
        `Copy inputs/template.txt to ${expected}`,
      );
    },
  );

  describe("not copy but report parameter errors", () => {
    it("when day is undefined", () => {
      setupNextDay(
        undefined,
        "this text is ignored",
        "",
        new CopyCommandPrinter(),
        new ReturnsEmptyString(),
        new NoAction(),
      );

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(UsageInstructions);
    });

    it("when puzzle name is undefined", () => {
      setupNextDay(
        10,
        undefined,
        "",
        new CopyCommandPrinter(),
        new ReturnsEmptyString(),
        new NoAction(),
      );

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(UsageInstructions);
    });
  });
});

describe("setup-next-day integration test", () => {
  const prefix = "setup-next-day-tests-";
  let tempDir = "";

  beforeEach(() => {
    // Arrange: Prepare temporary directory to receive copied files
    tempDir = mkdtempSync(path.join(tmpdir(), prefix));

    mkdirSync(path.join(tempDir, "src"));
    mkdirSync(path.join(tempDir, "tests"));
    mkdirSync(path.join(tempDir, "inputs"));

    // Prerequisite: tempDir must exist
    statSync(tempDir);
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true });
  });

  function assertExists(
    parentDir: string = "src",
    fileName: string = "10-puzzleNameX.ts",
  ) {
    statSync(path.join(tempDir, parentDir, fileName));
  }

  it("should copy files to destination folder", () => {
    setupNextDay(
      10,
      "puzzleName",
      tempDir,
      new UseFsCopyFile(),
      new FileReader(),
      new FileWriter(),
    );

    assertExists("src", "10-puzzleName.ts");
    assertExists("tests", "10-puzzleName.test.ts");
    assertExists("inputs", "10-puzzleName.txt");
    assertExists("inputs", "10-puzzleName-from-puzzle-description.txt");
  });

  describe("should replace keywords", () => {
    it("in copied source file", () => {
      setupNextDay(
        10,
        "puzzleName",
        tempDir,
        new UseFsCopyFile(),
        new FileReader(),
        new FileWriter(),
      );
      const filePath = path.join(tempDir, "src", "10-puzzleName.ts");
      const actual = readFileSync(filePath, {
        encoding: "utf-8",
      });

      expect(actual).not.toMatch(/\btemplateFunction\b/);
      expect(actual).toMatch(/\bpuzzleName\b/);
    });

    it("in copied test file", () => {
      setupNextDay(
        10,
        "puzzleName",
        tempDir,
        new UseFsCopyFile(),
        new FileReader(),
        new FileWriter(),
      );
      const filePath = path.join(tempDir, "tests", "10-puzzleName.test.ts");
      const actual = readFileSync(filePath, {
        encoding: "utf-8",
      });

      expect(actual).not.toMatch(/\btemplate\b/);
      expect(actual).toMatch(/\b10-puzzleName\b/);

      expect(actual).not.toMatch(/\btemplateFunction\b/);
      expect(actual).toMatch(/\bpuzzleName\b/);
    });
  });
});

class CopyCommandPrinter implements CopyCommand {
  copy(sourcePath: string, destinationPath: string): void {
    console.log(`Copy ${sourcePath} to ${destinationPath}`);
  }
}

class ReturnsEmptyString implements Reader {
  read(_filePath: string): string {
    return "";
  }
}

class NoAction implements Writer {
  write(_filePath: string, _text: string): void {}
}
