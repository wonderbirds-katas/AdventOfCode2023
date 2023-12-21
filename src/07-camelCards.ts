// Part 1 - Understanding the problem
// ==================================
//
// This is a variation of the Poker Hands kata.
//
// Find the rank of a hand of cards when compared to all others in the list.
// Multiply the bid next to the hand with the rank of the hand to find the winning.
// Give the sum all winnings.
//
// Trivial cases:
//
// [[98K24, 0]] -> 0 // Random hand w/o any pattern
// [[98K24, 1]] -> 1 // Random hand w/o any pattern
// [[98K24, 42]] -> 42 // Random hand w/o any pattern
//
// Two trivial hands:
//
// [[98K24, 2], [38K24, 3]] -> 2*2 + 1*3 = 7 // Random hand w/o any pattern
//
// Solution approach
// -----------------
//
// For each Hand = [cards, bid]
//   rankHand()
//
// rankHand() is a function to calculate the hexadecimal Rank, e.g. 0x3AA37B
//     The first hex digit (3) corresponds to HandType.
//     The subsequent digit (AA37B) correspond to the value of the card at each place.
//
//  Sort the hands by Rank given by rankHand()
//  Reduce to sum(position in list * bid)
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

export function camelCards(input: string): number {
  return input
    .split("\n")
    .map(parseRow)
    .map((hand) => {
      //      console.log(hand);
      return hand.bid;
    })
    .reduce(
      (accumulated, currentBid, currentIndex) =>
        accumulated + (currentIndex + 1) * currentBid,
    );
}
function parseRow(row: string): Hand {
  const cards = row.substring(0, 5);

  const bidStr = row.substring(5);
  const bid = Number(bidStr);

  return new Hand(cards, bid);
}

class Hand {
  constructor(
    readonly cards: string,
    readonly bid: number,
  ) {}
}
