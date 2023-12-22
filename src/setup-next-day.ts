const argv = require("minimist")(process.argv.slice(2));

export function setupNextDay(day: number) {
  console.log(`Setting up day ${day}`);
}

setupNextDay(argv._[0]);
