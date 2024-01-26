// Part 1 - Understanding the problem
// ==================================
//
// - when stepping on a slope the next step must be downhill
// - never step on a tile twice
// - what is the longest hike?
//
// Tests from the problem description
//
// "." -> 1
//
// "."
// "." -> 2 // downwards
//
// Solution approach
// -----------------
//
// Start with a 1D vertical map to generate some test cases
//
// Refactor to a pathfinding / flood fill algorithm
//
// In the recursive function build up a tree of valid path locations considering
// - If tile has been visited before, the path is a dead end and should be removed from the result tree
// - The recursive calls shall be filtered by validity - do not recurse to invalid tiles
//
// Algorithm
// ---------
//
// Find the location of the the entrance in the top row (entrance)
//
// Call the helper method with current=entrance, hike=fresh and empty, list of hikes is empty
//
// Find the location of the exit of the bottom row (exit)
//
// Filter the list of hikes constructed by the helper method by hikes ending at the exit of the map
//
// Select the longest hike from the hikes ending at the exit
//
// helper method:
//     Add the current position to the hike and increase its length by 1
//
//     identify the locations of the next allowed steps considering (options)
//         we may not step outside the map
//         we may not step back
//         we may not step on a tile already contained in the hike
//         we may not step on a slope pointing to the current position
//         we may not step onto a forest tile
//
//     if there is no location left to step on,
//         add the hike to the list of hikes
//         return from the recursion
//
//     for each location in options
//         create a copy of the current hike
//         call the helper method with location, copy of hike
//
// Data structures
// ---------------
//
// tile:
// - SlopeLeft ('<') | SlopeRight ('>') | SlopeUp ('^') | SlopeDown ('v') | Forest ('#') | Path('.')
//
// location:
// - x, y : number
//
// hike:
// - tiles : location[]
// - length : number
//
// Part 2 - Understanding the problem
// ==================================
//
// all slopes shall be treated like normal paths
//
// Solution approach
// -----------------
//
// extract the validation in the filter for next steps into a concrete strategy implementation
// add another strategy implementation treating slopes like paths
//
// Problem: Too many Hikes
// -------
//
// The algorithm reaches the maximum allowed recursion depth, i.e. the number of Hikes (leaves) exceeds the
// memory limit
//
// What causes the problem? More Hike-parts are evaluated again and again
// ------------------------
//
// Locations can be reached from multiple Hikes.
// The shortest Hike reaches a Location first, then the longer Hike, then another even longer Hike and so on.
// The current implementation evaluates all Hikes reaching that Location every time a longer Hike to that Location
// is found.
//
// Solution approach: Process Hike parts only once
// -----------------
//
// For each Location of the Map visited, store the Hike
// If a longer Hike reaches a Location with an attached Hike:
//    Replace the beginning of the attached Hike by the current, longer Hike
//
// Consequences
// ------------
//
// The findHikes method can just return the length of the path attached to the exit of the Map
// instead of iterating over all possible hikes.
//
enum Tile {
  Path = ".",
  Tree = "#",
  DownWest = "<",
  DownNorth = "^",
  DownSouth = "v",
  DownEast = ">",
}

enum SymbolForTile {
  "." = Tile.Path,
  "#" = Tile.Tree,
  "<" = Tile.DownWest,
  "^" = Tile.DownNorth,
  "v" = Tile.DownSouth,
  ">" = Tile.DownEast,
}

class Location {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  equals(other: Location): boolean {
    return this.x === other.x && this.y === other.y;
  }

  stepDown(): Location {
    return new Location(this.x, this.y + 1);
  }

  stepLeft(): Location {
    return new Location(this.x - 1, this.y);
  }

  stepRight(): Location {
    return new Location(this.x + 1, this.y);
  }

  stepUp(): Location {
    return new Location(this.x, this.y - 1);
  }

  minus(other: Location): Location {
    return new Location(this.x - other.x, this.y - other.y);
  }
}

class Hike {
  private _tiles: Location[] = [];

  end() {
    return this._tiles[this._tiles.length - 1];
  }

  add(location: Location) {
    this._tiles.push(location);
  }

  length(): number {
    // The start tile does not count as a step
    return this._tiles.length - 1;
  }

  clone() {
    const result = new Hike();
    result._tiles = [...this._tiles];

    return result;
  }

  contains(location: Location) {
    return this._tiles.filter((tile) => tile.equals(location)).length > 0;
  }
}

class Map {
  private _map: string[][];
  private _stepValidator: StepValidator;

  constructor(input: string, stepValidator: StepValidator) {
    this._map = input.split("\n").map((rowString) => rowString.split(""));
    this._stepValidator = stepValidator;
  }

  at(location: Location): Tile {
    const tileSymbol = this._map[location.y][location.x];

    return SymbolForTile[tileSymbol as keyof typeof Tile];
  }

  findEntrance() {
    const x = this._map[0].indexOf(Tile.Path);
    return new Location(x, 0);
  }

  findExit() {
    const x = this._map[this.height() - 1].indexOf(Tile.Path);
    return new Location(x, this._map.length - 1);
  }

  findHikes(): Hike[] {
    const entrance = this.findEntrance();

    let hikes: Hike[] = [];
    this.findHikesHelper(entrance, new Hike(), hikes);

    return hikes;
  }

  private findHikesHelper(current: Location, hike: Hike, result: Hike[]) {
    hike.add(current);

    const options = [
      current.stepDown(),
      current.stepLeft(),
      current.stepRight(),
      current.stepUp(),
    ];
    // prettier-ignore
    const allowed = options.filter((option) =>
      this._stepValidator.isStepAllowed(current, option, hike, this),
    );

    if (allowed.length === 0) {
      result.push(hike);
    }

    for (const option of allowed) {
      this.findHikesHelper(option, hike.clone(), result);
    }
  }

  public contains(coordinate: Location) {
    return (
      coordinate.x >= 0 &&
      coordinate.x < this.width() &&
      coordinate.y >= 0 &&
      coordinate.y < this.height()
    );
  }

  private width(): number {
    return this._map[0].length;
  }

  private height(): number {
    return this._map.length;
  }
}

interface StepValidator {
  isStepAllowed(
    source: Location,
    target: Location,
    hike: Hike,
    map: Map,
  ): boolean;
}

class SlideDownIcySlopes implements StepValidator {
  public isStepAllowed(
    source: Location,
    target: Location,
    hike: Hike,
    map: Map,
  ): boolean {
    return (
      map.contains(target) &&
      map.at(target) !== Tile.Tree &&
      (map.at(source) === Tile.Path ||
        (map.at(source) === Tile.DownEast &&
          target.minus(source).equals(new Location(1, 0))) ||
        (map.at(source) === Tile.DownSouth &&
          target.minus(source).equals(new Location(0, 1))) ||
        (map.at(source) === Tile.DownWest &&
          target.minus(source).equals(new Location(-1, 0))) ||
        (map.at(source) === Tile.DownNorth &&
          target.minus(source).equals(new Location(0, -1)))) &&
      !hike.contains(target)
    );
  }
}

class TreatSlopesLikePaths implements StepValidator {
  public isStepAllowed(
    source: Location,
    target: Location,
    hike: Hike,
    map: Map,
  ): boolean {
    return (
      map.contains(target) &&
      map.at(target) !== Tile.Tree &&
      (map.at(source) === Tile.Path ||
        map.at(source) === Tile.DownEast ||
        map.at(source) === Tile.DownSouth ||
        map.at(source) === Tile.DownWest ||
        map.at(source) === Tile.DownNorth) &&
      !hike.contains(target)
    );
  }
}

//
export function aLongWalk(input: string): number {
  const map = new Map(input, new TreatSlopesLikePaths());

  let hikes = map.findHikes();

  const exit = map.findExit();
  const validHikes = hikes.filter((hike) => hike.end().equals(exit));
  const hikeLengths = validHikes.map((hike) => hike.length());

  if (hikeLengths.length === 0) {
    return 0;
  }
  return Math.max(...hikeLengths);
}
