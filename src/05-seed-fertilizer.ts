export function seedLocation(input: string): number {
  const inputLines = input.split("\n");

  const seeds = parseSeeds(inputLines);
  const mappers = parseMappers(inputLines);

  for (const mapper of mappers) {
    for (const seed of seeds) {
      mapper.applyTo(seed);
    }
  }

  return seeds[0].properties["location"];
}

class Seed {
  properties: Map<string, number> = new Map<string, number>();
  constructor(theNumber: number) {
    this.properties["seed"] = theNumber;
  }
}

class Mapper {
  constructor(source: string, destination: string) {}

  applyTo(seed: Seed) {
    seed.properties["location"] = seed.properties["seed"];
  }
}

class MapperBuilder {
  setSourceProperty(value: string) {}
  setDestinationProperty(value: string) {}

  addRange(source: number[], destination: number[]) {}

  build() {
    return new Mapper("", "");
  }
}

function parseSeeds(input: string[]): Seed[] {
  const numbers = input[0].split(" ").map((str) => Number(str));
  return numbers.map((number) => new Seed(number));
}

function parseMappers(input: string[]): Mapper[] {
  const builder = new MapperBuilder();
  builder.setSourceProperty("");
  builder.setDestinationProperty("");
  builder.addRange([], []);

  return [builder.build()];
}
//
