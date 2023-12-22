import {
  CopyCommandPrinter,
  setupNextDay,
  UsageInstructions,
} from "../src/setup-next-day";
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
    ["src/12-puzzle-name.ts", 12, "puzzle-name"],
    ["src/42-puzzle-name.ts", 42, "puzzle-name"],
    ["src/10-other-name.ts", 10, "other-name"],
  ])("copy src/template.ts to %s", (expected, day, puzzleName) => {
    setupNextDay(day, puzzleName, new CopyCommandPrinter());

    expect(logSpy).toHaveBeenCalledWith(`Copy src/template.ts to ${expected}`);
  });

  describe("not copy but report parameter errors", () => {
    it("when day is undefined", () => {
      setupNextDay(undefined, "this text is ignored", new CopyCommandPrinter());

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(UsageInstructions);
    });

    it("when puzzle name is undefined", () => {
      setupNextDay(10, undefined, new CopyCommandPrinter());

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(UsageInstructions);
    });
  });
});
