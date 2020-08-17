// Implement your exercise in this file.  If you need to implement additional functions,
// remember to export them as well, if you need to access them in your unit test.
const results = {
    WIN: 'win',
    LOSS: 'loss',
    TIE: 'tie'
};

const ranks = {'2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, 'T': 9, 'J': 10, 'Q': 11, 'K': 12, 'A': 13 };

const suits = { 'S': 'Spades', 'H': 'Hearts', 'D': 'Diamonds', 'C': 'Clubs' };

const outcomes = {
    HIGH_CARD: 0,
    PAIR: 1,
    TWO_PAIR: 2,
    THREE_OF_A_KIND: 3,
    STRAIGHT: 4,
    FLUSH: 5,
    FULL_HOUSE: 6,
    FOUR_OF_A_KIND: 7,
    STRAIGHT_FLUSH: 8,
    ROYAL_FLUSH: 9
};

class PokerHand {
    constructor(cards) {
        let arr = cards.split(' ');
        this.cards = arr.map(card => new Card(card)).sort((a, b) => a.compareTo(b));
    }

    compareWith(other) {
        let thisOutcome = this.determineOutcome();
        let otherOutcome = other.determineOutcome();

        if (thisOutcome.rank > otherOutcome.rank) {
            return results.WIN;
        }

        if (thisOutcome.rank < otherOutcome.rank) {
            return results.LOSS;
        }

        // Tiebreaker...
        if (thisOutcome.tieBreaker > otherOutcome.tieBreaker) {
            return results.WIN;
        }

        if (thisOutcome.tieBreaker < otherOutcome.tieBreaker) {
            return results.LOSS;
        }

        return results.TIE;
    }

    determineOutcome() {
        if (this.isRoyalFlush()) {
            // TODO - any way to indicate tiebreaker failure?
            return new Outcome(outcomes.ROYAL_FLUSH, 0);
        }

        if (this.isStraightFlush()) {
            return new Outcome(outcomes.STRAIGHT_FLUSH, this.cards[4].rankValue());
        }

        if (this.isFourOfAKind()) {
            let card = Object.entries(this.getUniqueRanks()).find(entry => entry[1] === 4);
            return new Outcome(outcomes.FOUR_OF_A_KIND, ranks[card[0]]);
        }

        if (this.isFullHouse()) {
            let card = Object.entries(this.getUniqueRanks()).find(entry => entry[1] === 3);
            return new Outcome(outcomes.FULL_HOUSE, ranks[card[0]]);
        }

        if (this.isFlush()) {
            return new Outcome(outcomes.FLUSH, this.cards[4].rankValue());
        }

        if (this.isStraight()) {
            let highCard = this.cards[4];
            if (highCard.rank == 'A' && this.cards[3].rank !== 'K') {
                // If high card is an Ace, but next highest card is not a King, it is a straight with Ace low,
                // so tiebreaker is the card at the top of the sequence (should be a 5)
                highCard = this.cards[3];
            }
            return new Outcome(outcomes.STRAIGHT, highCard.rankValue());
        }

        if (this.isThreeOfAKind()) {
            let card = Object.entries(this.getUniqueRanks()).find(entry => entry[1] === 3);
            return new Outcome(outcomes.THREE_OF_A_KIND, ranks[card[0]]);
        }

        if (this.isTwoPairs()) {
            let tieBreaker = Object.entries(this.getUniqueRanks()).filter(entry => entry[1] == 2).map(entry => ranks[entry[0]]).sort()[1];
            return new Outcome(outcomes.TWO_PAIR, tieBreaker);
        }

        if (this.isPair()) {
            let card = Object.entries(this.getUniqueRanks()).find(entry => entry[1] === 2);
            return new Outcome(outcomes.PAIR, ranks[card[0]]);
        }

        return new Outcome(outcomes.HIGH_CARD, this.cards[4].rankValue());
    }

    isRoyalFlush() {
        return this.isFlush() && this.cards[0].rank === 'T' && this.cards[4].rank === 'A';
    }

    isStraightFlush() {
        return this.isFlush() && this.isStraight();
    }

    isFourOfAKind() {
        return Object.entries(this.getUniqueRanks()).find(entry => entry[1] === 4) !== undefined;
    }

    isFullHouse() {
        let uniqueEntries = Object.entries(this.getUniqueRanks());
        return uniqueEntries.length == 2 &&
            uniqueEntries.find(entry => entry[1] == 3) !== undefined &&
            uniqueEntries.find(entry => entry[1] == 2) !== undefined;
    }

    isFlush() {
        return new Set(this.cards.map(card => card.suit)).size === 1;
    }

    isStraight() {
        // If there's an Ace, this only accounts for Ace High - also need to account for Ace low
        if (this.cards[4].rankValue() - this.cards[0].rankValue() == 4) {
            return true;
        }

        // If no Ace, then no need to worry about Ace low
        if (this.cards[4].rank !== 'A') {
            return false;
        }

        // Ok, so high card is Ace - see if other 4 cards are 2 thru 5 (ranks will sum to 10)
        return this.cards.slice(0, 4).map(card => card.rankValue()).reduce((acc, rank) => {
            acc += rank;
            return acc;
        }, 0) == 10;
    }

    isThreeOfAKind() {
        return Object.entries(this.getUniqueRanks()).find(entry => entry[1] === 3) !== undefined;
    }

    isTwoPairs() {
        let uniqueEntries = Object.entries(this.getUniqueRanks());
        return uniqueEntries.length == 3 &&
            uniqueEntries.find(entry => entry[1] == 2).length === 2;
    }

    isPair() {
        let uniqueEntries = Object.entries(this.getUniqueRanks());
        return uniqueEntries.length == 4 &&
            uniqueEntries.find(entry => entry[1] == 2) !== undefined;
    }

    getUniqueRanks() {
        return this.cards.map(card => card.rank).reduce((acc, rank) => {
            acc[rank] = acc[rank] === undefined ? 1 : acc[rank] + 1;
            return acc;
        }, {});
    }

    toString() {
        return this.cards.map(card => card.toString()).join(', ');
    }
}

class Card {
    constructor(card) {
        let arr = Array.from(card.toUpperCase());
        this.rank = arr[0];
        this.suit = arr[1];
    }

    suitName() {
        return suits[this.suit];
    }

    rankValue() {
        return ranks[this.rank];
    }

    compareTo(other) {
        return this.rankValue() - other.rankValue();
    }

    toString() {
        return `${this.rank} of ${suits[this.suit]}`;
    }
}

class Outcome {
    constructor(rank, tieBreaker) {
        this.rank = rank;
        this.tieBreaker = tieBreaker;
    }
}

module.exports = { PokerHand, Card, outcomes, results };