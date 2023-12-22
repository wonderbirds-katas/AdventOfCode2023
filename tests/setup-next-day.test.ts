import {
  CopyCommandPrinter,
  setupNextDay,
  UsageInstructions,
} from "../src/setup-next-day";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
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
    ["test/08-puzzle-name.test.ts", 8, "puzzle-name"],
    ["test/10-other-name.test.ts", 10, "other-name"],
  ])("copy test/template.test.ts to %s", (expected, day, puzzleName) => {
    setupNextDay(day, puzzleName, "", new CopyCommandPrinter());

    expect(logSpy).toHaveBeenCalledWith(
      `Copy test/template.test.ts to ${expected}`,
    );
  });

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
  it("should copy files to destination folder", () => {
    const prefix = "setup-next-day-tests-";

    let tempDir = "";
    try {
      tempDir = mkdtempSync(path.join(tmpdir(), prefix));
      console.log(`Created temporary directory "${tempDir}"`);

      mkdirSync(path.join(tempDir, "src"));
      mkdirSync(path.join(tempDir, "test"));

      setupNextDay(10, "puzzle-name", tempDir, new CopyCommandPrinter());
    } finally {
      if (tempDir) {
        rmSync(tempDir, { recursive: true });
        console.log(`Deleted temporary directory "${tempDir}"`);
      }
    }
  });
});
