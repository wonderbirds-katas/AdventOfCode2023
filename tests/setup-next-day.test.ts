import {
  setupNextDay,
  UsageInstructions,
  UseFsCopyFile,
} from "../src/setup-next-day";
import { mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import * as path from "node:path";
import { tmpdir } from "node:os";
import SpyInstance = jest.SpyInstance;

describe("setup-next-day should", () => {
  let logSpy: SpyInstance<void, [message?: any, ...any[]], any>;

  beforeEach(() => {
    logSpy = jest.spyOn(global.console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it.each([
    ["src/08-puzzle-name.ts", 8, "puzzle-name"],
    ["src/12-puzzle-name.ts", 12, "puzzle-name"],
    ["src/42-puzzle-name.ts", 42, "puzzle-name"],
    ["src/10-other-name.ts", 10, "other-name"],
  ])("copy src/template.ts to %s", (expected, day, puzzleName) => {
    setupNextDay(day, puzzleName, "", new CopyCommandPrinter());

    expect(logSpy).toHaveBeenCalledWith(`Copy src/template.ts to ${expected}`);
  });

  it.each([
    [
      "/target-parent-dir/src/08-puzzle-name.ts",
      8,
      "puzzle-name",
      "/target-parent-dir",
    ],
  ])(
    "copy src/template.ts to %s",
    (expected, day, puzzleName, targetParentDir) => {
      setupNextDay(day, puzzleName, targetParentDir, new CopyCommandPrinter());

      expect(logSpy).toHaveBeenCalledWith(
        `Copy src/template.ts to ${expected}`,
      );
    },
  );

  it.each([
    ["tests/08-puzzle-name.test.ts", 8, "puzzle-name"],
    ["tests/10-other-name.test.ts", 10, "other-name"],
  ])("copy tests/template.test.ts to %s", (expected, day, puzzleName) => {
    setupNextDay(day, puzzleName, "", new CopyCommandPrinter());

    expect(logSpy).toHaveBeenCalledWith(
      `Copy tests/template.test.ts to ${expected}`,
    );
  });

  it.each([["inputs/08-puzzle-name.txt", 8, "puzzle-name"]])(
    "copy inputs/template.txt to %s",
    (expected, day, puzzleName) => {
      setupNextDay(day, puzzleName, "", new CopyCommandPrinter());

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
      );

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(UsageInstructions);
    });

    it("when puzzle name is undefined", () => {
      setupNextDay(10, undefined, "", new CopyCommandPrinter());

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
    fileName: string = "10-puzzle-nameX.ts",
  ) {
    statSync(path.join(tempDir, parentDir, fileName));
  }

  it("should copy files to destination folder", () => {
    setupNextDay(10, "puzzle-name", tempDir, new UseFsCopyFile());

    assertExists("src", "10-puzzle-name.ts");
    assertExists("tests", "10-puzzle-name.test.ts");
    assertExists("inputs", "10-puzzle-name.txt");
    assertExists("inputs", "10-puzzle-name-from-puzzle-description.txt");
  });
});

class CopyCommandPrinter {
  copy(sourcePath: string, destinationPath: string): void {
    console.log(`Copy ${sourcePath} to ${destinationPath}`);
  }
}
