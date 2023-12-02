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

| Day | Module name |
|-----|-------------|
| 0   | 00-template |

My personal input data is saved in the folder `inputs`. The puzzle solution is implemented in the folder `src` and the corresponding tests are kept in the folder `tests`.
