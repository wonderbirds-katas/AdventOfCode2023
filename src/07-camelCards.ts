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
// Jokers can substitute any card
// Jokers themselves have the lowest value, but they contribute to any set of cards
//
// Solution approach
// -----------------
//
// Set value of the "J" to 1
//
// WRONG: In the histogram, add +1 to every bin for each Joker
//
// Remove the Jokers from the Hand before calculating the HandType
// Apply the following map:
// 1 Joker:
// - High Card 0 -> One Pair 1
// - One Pair 1 -> Three of a kind 3
// - Two pair 2 -> Full House 4
// - Three of a kind 3 -> Four of a kind 5
// - Four of a kind 5 -> Five of a kind 6
//
// 2 Jokers:
// - High Card 0 -> Three of a kind 3
// - One Pair 1 -> Four of a kind 5
// - Three of a kind 3 -> Five of a kind 6
//
// 3 Jokers:
// - High Card 0 -> Four of a kind 5
// - One Pair 1 -> Five of a kind 6
//
// 4 Jokers:
// - High Card 0 -> Five of a kind 6
//
// 5 Jokers:
// = Five of a kind 6
//

export function camelCardsPart2(input: string): number {
  return camelCards(input, new CardFactoryPart2(), new HandFactoryPart2());
}

export class CardPart2 implements Card {
  private _cardValues: Map<string, number> = new Map<string, number>([
    ["J", 1],
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["T", 10],
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

class CardFactoryPart2 implements CardFactory {
  create(character: string): Card {
    return new CardPart2(character);
  }
}

export function camelCards(
  input: string,
  cardFactory: CardFactory = new CardFactoryPart1(),
  handFactory: HandFactory = new HandFactoryPart1(),
): number {
  const hands = input.split("\n").map(parseRow(cardFactory, handFactory));
  const sortedHands = hands.sort(compareHands);
  const sortedBids = sortedHands.map((hand) => hand.bid);
  return sortedBids.reduce(
    (accumulated, currentBid, currentIndex) =>
      accumulated + (currentIndex + 1) * currentBid,
  );
}

type ParseRowFn = (row: string) => Hand;

function parseRow(
  cardFactory: CardFactory,
  handFactory: HandFactory,
): ParseRowFn {
  return function (row: string): Hand {
    const cardCharacters = row.substring(0, 5);
    const cards = cardCharacters
      .split("")
      .map((character) => cardFactory.create(character));

    const bidStr = row.substring(5);
    const bid = Number(bidStr);

    return handFactory.create(cards, bid);
  };
}

function compareHands(a: Hand, b: Hand): number {
  return a.value - b.value;
}

interface CardFactory {
  create(character: string): Card;
}

class CardFactoryPart1 implements CardFactory {
  create(character: string): Card {
    return new CardPart1(character);
  }
}

interface Card {
  readonly character: string;
  readonly value: number;
}

export class CardPart1 implements Card {
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

interface Hand {
  readonly value: number;
  readonly cards: Card[];
  readonly bid: number;

  calculateValueOfHandType(): number;
}

interface HandFactory {
  create(cards: Card[], bid: number): Hand;
}

class HandFactoryPart1 implements HandFactory {
  create(cards: Card[], bid: number): Hand {
    return new HandPart1(cards, bid);
  }
}

class HandFactoryPart2 implements HandFactory {
  create(cards: Card[], bid: number): Hand {
    return new HandPart2(cards, bid);
  }
}

export class HandPart1 implements Hand {
  private _histogram: number[];

  constructor(
    readonly cards: Card[] = [],
    readonly bid: number,
  ) {
    this._histogram = this.histogram();
  }

  private histogram() {
    const highestCardValue = new CardPart1("A").value;
    const result: number[] = new Array(highestCardValue + 1).fill(0);

    for (const card of this.cards) {
      result[card.value]++;
    }

    return result;
  }

  toString(): string {
    const cardString = this.cards.map((c) => c.character).join("");

    return `${cardString} ${this.bid} ${this.calculateValueOfHandType()}`;
  }

  get value(): number {
    let valueOfHandType = this.calculateValueOfHandType();
    let valueOfCardSequence = this.calculateValueOfCardSequence();

    return valueOfHandType * 16 ** 5 + valueOfCardSequence;
  }

  private calculateValueOfCardSequence() {
    return this.cards
      .map((card) => card.value)
      .reduce((accumulator, currentValue) => 16 * accumulator + currentValue);
  }

  public calculateValueOfHandType() {
    let result = 0;

    if (this.isOnePair()) {
      result = 1;
    }

    if (this.isTwoPair()) {
      result = 2;
    }

    if (this.isThreeOfAKind()) {
      result = 3;
    }

    if (this.isFullHouse()) {
      result = 4;
    }

    if (this.isFourOfAKind()) {
      result = 5;
    }

    if (this.isFiveOfAKind()) {
      result = 6;
    }

    return result;
  }

  private isOnePair() {
    return 1 == this._histogram.filter((frequency) => frequency == 2).length;
  }

  private isTwoPair() {
    return 2 == this._histogram.filter((frequency) => frequency == 2).length;
  }

  private isThreeOfAKind() {
    return 1 === this._histogram.filter((frequency) => frequency === 3).length;
  }

  private isFullHouse() {
    return this.isThreeOfAKind() && this.isOnePair();
  }

  private isFourOfAKind() {
    return 1 === this._histogram.filter((frequency) => frequency === 4).length;
  }

  private isFiveOfAKind() {
    return 1 === this._histogram.filter((frequency) => frequency === 5).length;
  }
}

export class HandPart2 implements Hand {
  private readonly _histogram: number[] = [];

  constructor(
    readonly cards: Card[] = [],
    readonly bid: number,
  ) {
    this._histogram = this.histogram();
  }

  private histogram() {
    const highestCardValue = new CardPart2("A").value;
    const result: number[] = new Array(highestCardValue + 1).fill(0);

    for (const card of this.cards) {
      if (card.value !== 1) {
        result[card.value]++;
      }
    }

    return result;
  }

  toString(): string {
    const cardString = this.cards.map((c) => c.character).join("");

    return `Hand Part 2: ${cardString} ${
      this.bid
    } ${this.calculateValueOfHandType()}`;
  }

  get value(): number {
    let valueOfHandType = this.calculateValueOfHandType();
    let valueOfCardSequence = this.calculateValueOfCardSequence();

    return valueOfHandType * 16 ** 5 + valueOfCardSequence;
  }

  private calculateValueOfCardSequence() {
    return this.cards
      .map((card) => card.value)
      .reduce((accumulator, currentValue) => 16 * accumulator + currentValue);
  }

  private _joker = new CardPart2("J");

  public calculateValueOfHandType() {
    let result = 0;

    if (this.isOnePair()) {
      result = 1;
    }

    if (this.isTwoPair()) {
      result = 2;
    }

    if (this.isThreeOfAKind()) {
      result = 3;
    }

    if (this.isFullHouse()) {
      result = 4;
    }

    if (this.isFourOfAKind()) {
      result = 5;
    }

    if (this.isFiveOfAKind()) {
      result = 6;
    }

    const numberOfJokers = this.cards.filter((c) => c.value === 1).length;
    if (numberOfJokers == 1) {
      const mapResultTo = new Map<number, number>([
        [0, 1], // high card -> one pair
        [1, 3], // one pair -> three of a kind
        [2, 4], // two pair -> full house
        [3, 5], // three of a kind -> four of a kind
        [5, 6], // four of a kind -> five of a kind
      ]);
      result = mapResultTo.get(result)!;
    }

    if (numberOfJokers == 2) {
      const mapResultTo = new Map<number, number>([
        [0, 3], // high card -> three of a kind
        [1, 5], // one pair -> four of a kind
        [3, 6], // three of a kind -> five of a kind
      ]);
      result = mapResultTo.get(result)!;
    }

    if (numberOfJokers == 3) {
      const mapResultTo = new Map<number, number>([
        [0, 5], // high card -> four of a kind
        [1, 6], // one pair -> five of a kind
      ]);
      result = mapResultTo.get(result)!;
    }

    if (numberOfJokers == 4) {
      const mapResultTo = new Map<number, number>([
        [0, 6], // high card -> five of a kind
      ]);
      result = mapResultTo.get(result)!;
    }

    if (numberOfJokers == 5) {
      result = 6;
    }

    return result;
  }

  private isOnePair() {
    return 1 == this._histogram.filter((frequency) => frequency == 2).length;
  }

  private isTwoPair() {
    return 2 == this._histogram.filter((frequency) => frequency == 2).length;
  }

  private isThreeOfAKind() {
    return 1 === this._histogram.filter((frequency) => frequency === 3).length;
  }

  private isFullHouse() {
    return this.isThreeOfAKind() && this.isOnePair();
  }

  private isFourOfAKind() {
    return 1 === this._histogram.filter((frequency) => frequency === 4).length;
  }

  private isFiveOfAKind() {
    return 1 === this._histogram.filter((frequency) => frequency === 5).length;
  }
}
