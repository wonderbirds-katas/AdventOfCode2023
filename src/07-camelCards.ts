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
    .sort(compareHands)
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
  const cardCharacters = row.substring(0, 5);
  const cards = cardCharacters
    .split("")
    .map((character) => new Card(character));

  const bidStr = row.substring(5);
  const bid = Number(bidStr);

  return new Hand(cards, bid);
}

function compareHands(a: Hand, b: Hand): number {
  return a.calculateValue() - b.calculateValue();
}

class Card {
  private _cardValues: Map<string, number> = new Map<string, number>([
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["T", 10],
    ["J", 11],
    ["Q", 12],
    ["K", 13],
    ["A", 14],
  ]);

  constructor(readonly character: string) {
    if (!this._cardValues.has(character)) {
      throw new Error(`Invalid card "${character}"`);
    }
  }

  get value(): number {
    return this._cardValues.get(this.character)!;
  }
}

class Hand {
  constructor(
    readonly cards: Card[] = [],
    readonly bid: number,
  ) {}

  calculateValue(): number {
    let valueOfHandType = this.calculateValueOfHandType();
    let valueOfCardSequence = this.calculateValueOfCardSequence();

    return valueOfHandType * 16 ** 5 + valueOfCardSequence;
  }

  private calculateValueOfCardSequence() {
    return this.cards
      .map((card) => card.value)
      .reduce((accumulator, currentValue) => 16 * accumulator + currentValue);
  }

  private calculateValueOfHandType() {
    const bins: number[] = new Array(14).fill(0);

    for (const card of this.cards) {
      bins[card.value]++;
    }

    const numberOfPairs = bins.filter((frequency) => frequency == 2).length;

    let result = 0;
    if (numberOfPairs == 1) {
      result = 1;
    }

    return result;
  }
}
