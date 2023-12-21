# AdventOfCode2023

This repository contains TypeScript solutions for the [Advent of Code 2023](https://adventofcode.com/2023/) puzzles.

## Thanks

Many thanks to [JetBrains](https://www.jetbrains.com/?from=generator-kata-net-core) who provide
an [Open Source License](https://www.jetbrains.com/community/opensource/) for my projects ❤️.

## Prerequisites

- [node.js](https://nodejs.org/) (I am using v21.3.0)
- [TypeScript (tsc)](https://www.typescriptlang.org/) (I am using version 5.3.2)

## Build and Test

To build and run tests for all puzzles, type

```sh
npm test
```

## Layout of this repository

For every day and part of the puzzles I create a new branch. Branch names follow the schema `day-1-part-1`. The `main` branch does not contain solutions, only a template for new code.

If you want to check a particular solution in this repository, then just select the corresponding branch in the **branches** dropdown list above.

This way, you do not risk accidentally seeing solutions for puzzles you have not solved yet.

## How to find a solution by day of advent of code?

The following table maps the day of the advent of code puzzles to the filename prefixes of the corresponding solution.

| Day | Solution                                          | Tests                                                            | Description                                      |
|-----|---------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------|
| 0   | template                                          |                                                                  |                                                  |
| 1   | [01-trebuchet](./src/01-trebuchet.ts)             | [01-trebuchet.test](./tests/01-trebuchet.test.ts)                | Decode numbers in strings like "tre3bu7chsixt"   |
| 2   | [02-cubeConundrum](./src/02-cubeConundrum.ts)     | [02-cubeConundrum.test](./tests/02-cubeConundrum.test.ts)        | Draw colored cubes from a bag                    |
| 3   | [03-gearRatios](./src/03-gearRatios.ts)           | [03-gearRatios.test](./tests/03-gearRatios.test.ts)              | Identify numbers in huge text file               |
| 4   | [04-scratchcards](./src/04-scratchcards.ts)       | [04-scratchcards.test.ts](./tests/04-scratchcards.test.ts)       | Match numbers to winning numbers on scratchcards |
| 5   | [05-seed-fertilizer](./src/05-seed-fertilizer.ts) | [05-seed-fertilizer.test.ts](./tests/05-seed-fertilizer.test.ts) | Apply number mapping ranges subsequently         |
| 6   | [06-wait-for-it](./src/06-wait-for-it.ts)         | [06-wait-for-it.test.ts](./tests/06-wait-for-it.test.ts)         | Find range of inputs to win a race               |
| 7   | [07-camelCards](./src/07-camelCards.ts)           | [07-camelCards.test.ts](./tests/07-camelCards.test.ts)           |                                                  |

My personal input data is saved in the folder [inputs](./inputs). The puzzle solution is implemented in the folder [src](./src) and the corresponding tests are kept in the folder [tests](./tests).

## Using the template for a puzzle

1. Extend the table above with the chosen module name
2. In each folder of [inputs](./inputs), [src](./src), [tests](./tests)

   1. copy the template in that folder and give it the name of the chosen module
   2. in the copied file, replace the word `template` by the name of the function implementing the solution

3. Fill the file in the [inputs](./inputs) directory with the puzzle input
