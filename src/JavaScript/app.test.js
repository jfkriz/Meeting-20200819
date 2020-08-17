const { PokerHand, outcomes, results } = require('./app');

// This is a Jest unit test - see https://jestjs.io/docs/en/getting-started for more information

describe('PokerHand', () => {
    describe('compareWith', () => {
        describe('Royal Flush', () => {
            test('beats Straight Flush', () => {
                let hand1 = new PokerHand('AD TD KD JD QD');
                let hand2 = new PokerHand('9D TD JD QD KD');
    
                expect(hand1.compareWith(hand2)).toBe(results.WIN);
                expect(hand2.compareWith(hand1)).toBe(results.LOSS);
            });
        });

        describe('Straight Flush', () => {
            test('beats Four of a Kind', () => {
                let hand1 = new PokerHand('AD 2D 3D 4D 5D');
                let hand2 = new PokerHand('9D 9H 9S 9C AD');
    
                expect(hand1.compareWith(hand2)).toBe(results.WIN);
                expect(hand2.compareWith(hand1)).toBe(results.LOSS);
            });

            test('high card breaks tie', () => {
                let hand1 = new PokerHand('3D 4D 5D 6D 7D');
                let hand2 = new PokerHand('2H 3H 4H 5H 6H');
    
                expect(hand1.compareWith(hand2)).toBe(results.WIN);
                expect(hand2.compareWith(hand1)).toBe(results.LOSS);
            });            
        });

        describe('Four of a Kind', () => {
            test('beats Full House', () => {
                let hand1 = new PokerHand('9D 9H 9S 9C AD');
                let hand2 = new PokerHand('9D 9H 9S AC AD');
    
                expect(hand1.compareWith(hand2)).toBe(results.WIN);
                expect(hand2.compareWith(hand1)).toBe(results.LOSS);
            });

            test('high card breaks tie', () => {
                let hand1 = new PokerHand('TD TH TS TC AD');
                let hand2 = new PokerHand('9D 9H 9S 9C AH');
    
                expect(hand1.compareWith(hand2)).toBe(results.WIN);
                expect(hand2.compareWith(hand1)).toBe(results.LOSS);
            });            
        });
    });

    describe('determineOutcome', () => {
        describe('Royal Flush', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('TD JD QD KD AD').determineOutcome().rank).toBe(outcomes.ROYAL_FLUSH)
            });
    
            test('should not be Royal Flush if different suits', () => {
                expect(new PokerHand('TD JS QD KD AD').determineOutcome().rank).not.toBe(outcomes.ROYAL_FLUSH)
            });
    
            test('should not be Royal Flush if not Ten thru Ace', () => {
                expect(new PokerHand('TD JD AS KD AD').determineOutcome().rank).not.toBe(outcomes.ROYAL_FLUSH)
            });
        });

        describe('Straight Flush', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('9D TD JD QD KD').determineOutcome().rank).toBe(outcomes.STRAIGHT_FLUSH)
            });
    
            test('Ace low should be correctly identified', () => {
                expect(new PokerHand('AD 2D 3D 4D 5D').determineOutcome().rank).toBe(outcomes.STRAIGHT_FLUSH)
            });

            test('should not be Straight Flush if different suits', () => {
                expect(new PokerHand('9D TS JD QD KD').determineOutcome().rank).not.toBe(outcomes.STRAIGHT_FLUSH)
            });
    
            test('should not be Straight Flush if not 5 sequential cards', () => {
                expect(new PokerHand('7D 9D TD JD QD').determineOutcome().rank).not.toBe(outcomes.STRAIGHT_FLUSH)
            });
        });

        describe('Four of a Kind', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('9D 9H 9S 9C AS').determineOutcome().rank).toBe(outcomes.FOUR_OF_A_KIND)
            });
    
            test('should not be identified if not correct cards', () => {
                expect(new PokerHand('9D TS JD QD KD').determineOutcome().rank).not.toBe(outcomes.FOUR_OF_A_KIND)
            });
        });

        describe('Full House', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('9D 9H 9S AC AS').determineOutcome().rank).toBe(outcomes.FULL_HOUSE)
            });
    
            test('should not be identified if missing the pair', () => {
                expect(new PokerHand('9D 9H 9S QD KD').determineOutcome().rank).not.toBe(outcomes.FULL_HOUSE)
            });

            test('should not be identified if missing the three-of-a-kind', () => {
                expect(new PokerHand('8D 9H 9S QD QH').determineOutcome().rank).not.toBe(outcomes.FULL_HOUSE)
            });
        });

        describe('Flush', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('2D 4D 6D 8D TD').determineOutcome().rank).toBe(outcomes.FLUSH)
            });
    
            test('should not be identified if different suits', () => {
                expect(new PokerHand('2D 4H 6D 8D TD').determineOutcome().rank).not.toBe(outcomes.FLUSH)
            });
        });

        describe('Straight', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('9H TD JC QS KD').determineOutcome().rank).toBe(outcomes.STRAIGHT)
            });
    
            test('Ace low should be correctly identified', () => {
                expect(new PokerHand('AH 2D 3C 4S 5D').determineOutcome().rank).toBe(outcomes.STRAIGHT)
            });
    
            test('should not be Straight if not 5 sequential cards', () => {
                expect(new PokerHand('7H 9D TC JS QD').determineOutcome().rank).not.toBe(outcomes.STRAIGHT)
            });
        });

        describe('Three of a Kind', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('9D 9H 9S 8C AS').determineOutcome().rank).toBe(outcomes.THREE_OF_A_KIND)
            });
    
            test('should not be confused with a Full House', () => {
                expect(new PokerHand('9D 9S 9H QD QS').determineOutcome().rank).toBe(outcomes.FULL_HOUSE)
            });
        });

        describe('Two Pair', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('9D 9H 8S 8C AS').determineOutcome().rank).toBe(outcomes.TWO_PAIR)
            });
    
            test('should not be identified if incorret cards', () => {
                expect(new PokerHand('9D 2S 3H 6D 9S').determineOutcome().rank).not.toBe(outcomes.TWO_PAIR)
            });
        });

        describe('Pair', () => {
            test('should be correctly identified', () => {
                expect(new PokerHand('9D 9H 7S 8C AS').determineOutcome().rank).toBe(outcomes.PAIR)
            });
    
            test('should not be confused with a Full House', () => {
                expect(new PokerHand('9D 9S 9H QD QS').determineOutcome().rank).toBe(outcomes.FULL_HOUSE)
            });
        });
    });
});