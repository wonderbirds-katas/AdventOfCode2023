// ********************************************************************
// Solution for part 2 spawning multiple async/await jobs in parallel
// ********************************************************************
export async function seedLocationPart2Parallel(
  input: string,
): Promise<number> {
  const sectionSeparator = "\n\n";
  const sections = input.split(sectionSeparator);

  const mappers = parseMappers(sections);

  const [partitions, lengths] = splitIntoPartitions(sections);
  console.log("Partition sizes: " + lengths.join(", "));

  const promises = partitions.map(async (partition) =>
    findMinimumLocation(partition, mappers),
  );
  return await Promise.all(promises).then((minimumLocations) =>
    Math.min(...minimumLocations),
  );
}

// every pair of [startValue, length] becomes a seed partition
// which can be processed in parallel.
export function splitIntoPartitions(
  sections: string[],
): [Generator<Seed>[], number[]] {
  const numbers = getNumbersFrom(sections[0]);

  const startValues = numbers.filter((_, index) => index % 2 == 0);
  const intervalLengths = numbers.filter((_, index) => index % 2 == 1);

  const zipped = startValues.map((start, index) => [
    start,
    intervalLengths[index],
  ]);

  return [
    zipped.map(([start, intervalLength], index) =>
      seedGeneratorForPartition(start, intervalLength, index + 1),
    ),
    intervalLengths,
  ];
}

export function* seedGeneratorForPartition(
  start: number,
  length: number,
  partitionNumber: number,
): Generator<Seed> {
  const seedsPerPercent = Math.floor(length / 100.0);

  console.log(`Partition ${partitionNumber}: just started`);

  for (let current = start; current < start + length; current++) {
    if (current % seedsPerPercent === 0) {
      const percent = (100.0 * (current - start)) / length;
      console.log(`Partition ${partitionNumber}: ${percent.toFixed(1)} %`);
    }
    yield new Seed(current);
  }

  console.log(`Partition ${partitionNumber}: done`);
}

let findMinimumLocation = function (
  seeds: Generator<Seed>,
  mappers: Mapper[],
): Promise<number> {
  return new Promise<number>((resolve) => {
    let localMinimumLocation = Number.MAX_SAFE_INTEGER;
    for (const seed of seeds) {
      for (const mapper of mappers) {
        mapper.applyTo(seed);
      }
      localMinimumLocation = Math.min(
        localMinimumLocation,
        seed.properties["location"],
      );
    }
    resolve(localMinimumLocation);
  });
};

// ********************************************************************
// Solution for part 2 on single thread taking about 30 min on my laptop
// ********************************************************************

export function seedLocationPart2(input: string): number {
  const sectionSeparator = "\n\n";
  const sections = input.split(sectionSeparator);

  const mappers = parseMappers(sections);

  let minimumLocation = Number.MAX_SAFE_INTEGER;
  for (const seed of seedGenerator(sections)) {
    for (const mapper of mappers) {
      mapper.applyTo(seed);
    }
    minimumLocation = Math.min(minimumLocation, seed.properties["location"]);
  }

  return Math.min(minimumLocation);
}

export function* seedGenerator(sections: string[]): Generator<Seed> {
  const numbers = getNumbersFrom(sections[0]);

  const startValues = numbers.filter((_, index) => index % 2 == 0);
  const intervalLengths = numbers.filter((_, index) => index % 2 == 1);

  const seedCount = intervalLengths.reduce((acc, next) => acc + next, 0);
  const percent_0_1 = Math.ceil(0.001 * seedCount);
  console.log(`The generator will produce ${seedCount} numbers`);

  let counter = 0;

  for (let index = 0; index < startValues.length; index++) {
    const startValue = startValues[index];
    const intervalLength = intervalLengths[index];
    for (
      let seedNumber = startValue;
      seedNumber < startValue + intervalLength;
      seedNumber++
    ) {
      yield new Seed(seedNumber);

      counter++;
      if (counter % percent_0_1 == 0) {
        const percent = 100.0 * (counter / seedCount);
        console.log(`Processed ${percent.toFixed(1)} %`);
      }
    }
  }
}

// ********************************************************************
// Solution for part 1
// ********************************************************************

export function seedLocation(input: string): number {
  const sectionSeparator = "\n\n";
  const sections = input.split(sectionSeparator);

  const seeds = parseSeeds(sections);
  const mappers = parseMappers(sections);

  for (const mapper of mappers) {
    for (const seed of seeds) {
      mapper.applyTo(seed);
    }
  }

  const locations: number[] = seeds.map((seed) => seed.properties["location"]);

  return Math.min(...locations);
}

export class Seed {
  properties: Map<string, number> = new Map<string, number>();
  constructor(theNumber: number) {
    this.properties["seed"] = theNumber;
  }
}

class Mapper {
  _source: string = "";
  _destination: string = "";
  _ranges: MapRange[] = [];

  constructor(source: string, destination: string) {
    this._source = source;
    this._destination = destination;
  }

  addRange(sourceStart: number, destinationStart: number, length: number) {
    this._ranges.push(new MapRange(sourceStart, destinationStart, length));
  }

  applyTo(seed: Seed) {
    const sourceValue = seed.properties[this._source];

    const matchingRanges = this._ranges.filter((range) =>
      range.includes(sourceValue),
    );

    if (matchingRanges.length > 0) {
      seed.properties[this._destination] = matchingRanges[0].map(sourceValue);
    } else {
      seed.properties[this._destination] = sourceValue;
    }
  }
}

class MapRange {
  constructor(
    readonly sourceStart: number,
    readonly destinationStart: number,
    readonly length: number,
  ) {}

  includes(value: number): boolean {
    return this.sourceStart <= value && value < this.sourceStart + this.length;
  }

  map(value: number): number {
    const offset = value - this.sourceStart;
    return this.destinationStart + offset;
  }
}

function parseSeeds(sections: string[]): Seed[] {
  const seedNumbers = getNumbersFrom(sections[0]);
  return seedNumbers.map((seedNumber) => new Seed(seedNumber));
}

function getNumbersFrom(seedLine: string) {
  return seedLine
    .slice("seeds: ".length)
    .split(" ")
    .map((str) => Number(str));
}

function parseMappers(sections: string[]): Mapper[] {
  const result: Mapper[] = [];

  const mapSections = sections.slice(1);
  for (const section of mapSections) {
    const matchGroups = section.match(/([^-]+)-to-([^ ]+) map:/);
    const source = matchGroups![1];
    const destination = matchGroups![2];

    const mapper = new Mapper(source, destination);

    const ranges = section.split("\n").slice(1);
    for (const range of ranges) {
      const [destinationStart, sourceStart, length] = range
        .split(" ")
        .map((str) => Number(str));
      mapper.addRange(sourceStart, destinationStart, length);
    }

    result.push(mapper);
  }

  return result;
}
