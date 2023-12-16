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

class Seed {
  properties: Map<string, number> = new Map<string, number>();
  constructor(theNumber: number) {
    this.properties["seed"] = theNumber;
  }
}

class Mapper {
  _sourceStarts: number[] = [];
  _destinationStarts: number[] = [];
  _lengths: number[] = [];

  constructor(source: string, destination: string) {}

  addRange(sourceStart: number, destinationStart: number, length: number) {
    this._sourceStarts.push(sourceStart);
    this._destinationStarts.push(destinationStart);
    this._lengths.push(length);
  }

  applyTo(seed: Seed) {
    if (this._sourceStarts.length > 0) {
      seed.properties["location"] =
        this._destinationStarts[this._destinationStarts.length - 1];
    } else {
      seed.properties["location"] = seed.properties["seed"];
    }
  }
}

function parseSeeds(sections: string[]): Seed[] {
  const numbers = sections[0].split(" ").map((str) => Number(str));
  return numbers.map((number) => new Seed(number));
}

function parseMappers(sections: string[]): Mapper[] {
  // parse source and destination categories
  // while not empty line
  //   parse range
  //   add range

  const section = sections[1];

  const mapper = new Mapper("", "");

  const ranges = section.split("\n").slice(1);
  for (const range of ranges) {
    const [destinationStart, sourceStart, length] = range
      .split(" ")
      .map((str) => Number(str));
    mapper.addRange(sourceStart, destinationStart, length);
  }

  return [mapper];
}
