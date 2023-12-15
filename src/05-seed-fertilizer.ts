export function seedLocation(input: string): number {
  const seeds = parseSeeds(input);
  const mappers = parseMappers(input);

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

function parseSeeds(input: string): Seed[] {
  return [new Seed(Number(input[0]))];
}

function parseMappers(input: string): Mapper[] {
  const builder = new MapperBuilder();
  builder.setSourceProperty("");
  builder.setDestinationProperty("");
  builder.addRange([], []);

  return [builder.build()];
}
//
