import { setupNextDay, UsageInstructions } from "../src/setup-next-day";

it.each([
  ["./src/12-puzzle-name.ts", 12, "puzzle-name"],
  ["./src/42-puzzle-name.ts", 42, "puzzle-name"],
  ["./src/10-other-name.ts", 10, "other-name"],
])("copies src/template.ts to %s", (expected, day, puzzleName) => {
  const logSpy = jest.spyOn(global.console, "log").mockImplementation(() => {});
  setupNextDay(day, puzzleName);

  expect(logSpy).toHaveBeenCalledWith(`Copy ./src/template.ts to ${expected}`);
  logSpy.mockRestore();
});

describe("reports parameter errors and does not copy", () => {
  it("when day is undefined", () => {
    const logSpy = jest
      .spyOn(global.console, "log")
      .mockImplementation(() => {});
    setupNextDay(undefined, "this text is ignored");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(UsageInstructions);
    logSpy.mockRestore();
  });

  it("when puzzle name is undefined", () => {
    const logSpy = jest
      .spyOn(global.console, "log")
      .mockImplementation(() => {});
    setupNextDay(10, undefined);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(UsageInstructions);

    logSpy.mockRestore();
  });
});
