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
// In the recursive function build up a tree of valid path coordinates considering
// - If tile has been visited before, the path is a dead end and should be removed from the result tree
// - The recursive calls shall be filtered by validity - do not recurse to invalid tiles
//
// Data structures
// ---------------
//
// paths:
//
// + root (x, y)
// +--+ down
//    +---+ right
//        +---+ ...
//    +---+ down
//        +---+ ...
//
// Helper methods
// --------------
//
// - isCoordinateVisited(pathNode, x, y) - check whether the path to the node contains a given coordinate
// - removePaths(pathNode) - remove all paths that contain the given node
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
//
export function aLongWalk(input: string): number {
  return 0;
}
