type ParseSeedsFunction = (sections: string[]) => Seed[];

export function seedLocationPart2(input: string): number {
  return seedLocation(input, parseSeedsPart2);
}

export function parseSeedsPart2(sections: string[]): Seed[] {
  const numbers = getNumbersFrom(sections[0]);

  const startValues = numbers.filter((_, index) => index % 2 == 0);
  const intervalLengths = numbers.filter((_, index) => index % 2 == 1);

  const seedNumbers: number[] = [];

  for (let index = 0; index < startValues.length; index++) {
    const startValue = startValues[index];
    const intervalLength = intervalLengths[index];
    const seedNumberRange = Array.from(Array(intervalLength).keys()).map(
      (x) => startValue + x,
    );
    seedNumbers.push(...seedNumberRange);
  }

  return seedNumbers.map((seedNumber) => new Seed(seedNumber));
}

export function seedLocation(
  input: string,
  parseSeedsFn: ParseSeedsFunction = parseSeeds,
): number {
  const sectionSeparator = "\n\n";
  const sections = input.split(sectionSeparator);

  const seeds = parseSeedsFn(sections);
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
