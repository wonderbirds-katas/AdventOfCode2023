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
// ... list some simple tests showing how I understand the puzzle ...
//
// Tests from the problem description
//
// ... copy tests from problem description ...
//
// Solution approach
// -----------------
//
// ... describe solution and algorithm idea roughly ...

enum Tiles {
  Path = ".",
  Forest = "#",
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
    return this._tiles.length;
  }

  clone() {
    const result = new Hike();
    result._tiles = [...this._tiles];

    return result;
  }
}

class Map {
  private _map: string[][];

  constructor(input: string) {
    this._map = input.split("\n").map((rowString) => rowString.split(""));
  }

  at(location: Location): Tiles {
    const tileString = this._map[location.y][location.x];

    if (tileString === ".") {
      return Tiles.Path;
    }

    return Tiles.Forest;
  }

  findEntrance() {
    const x = this._map[0].indexOf(Tiles.Path.toString());
    return new Location(x, 0);
  }

  findExit() {
    const x = this._map[this.height() - 1].indexOf(Tiles.Path.toString());
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

    const options = [current.stepDown(), current.stepLeft()];
    const allowed = options.filter(
      (option) => this.contains(option) && this.at(option) === Tiles.Path,
    );

    if (allowed.length === 0) {
      result.push(hike);
    }

    for (const option of allowed) {
      this.findHikesHelper(option, hike.clone(), result);
    }
  }

  private contains(coordinate: Location) {
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

//
export function aLongWalk(input: string): number {
  const map = new Map(input);

  let hikes = map.findHikes();

  const exit = map.findExit();
  const validHikes = hikes.filter((hike) => hike.end().equals(exit));
  const hikeLengths = validHikes.map((hike) => hike.length());

  return Math.max(...hikeLengths);
}
