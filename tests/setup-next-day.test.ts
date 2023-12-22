import { setupNextDay } from "../src/setup-next-day";

it("logs messages", () => {
  const logSpy = jest.spyOn(global.console, "log");
  setupNextDay(8);

  expect(logSpy).toHaveBeenCalledWith("Setting up day 8");
  logSpy.mockRestore();
});
