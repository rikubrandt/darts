'use client'
import { BaseGame } from './BaseGame';

/**
 * X01Game - Implementation for X01 games (501, 301, 201, etc.)
 * 
 * Players start with X01 points and aim to reach exactly 0.
 * The last dart must hit a double or the bullseye.
 */
export class X01Game extends BaseGame {
  constructor(startingScore = 501) {
    super();
    this.startingScore = startingScore;
  }

  /**
   * Initialize a new game with the specified starting score
   * @param {Array} players - Array of player names
   * @returns {Object} - Initial scores object
   */
  initializeGame(players) {
    const scores = {};
    players.forEach(player => {
      scores[player] = this.startingScore;
    });
    return scores;
  }

  /**
   * Process a turn in X01 game
   * @param {Object} params - Game parameters
   * @returns {Object} - Result with updated state information
   */
  processTurn({ scores, currentDarts, currentPlayer }) {
    if (currentDarts.length === 0) {
      return { 
        isValid: false, 
        message: 'No darts thrown' 
      };
    }

    const currentScore = scores[currentPlayer];
    const turnTotal = currentDarts.reduce((sum, dart) => sum + dart.value, 0);
    const newScore = currentScore - turnTotal;
    const lastDart = currentDarts[currentDarts.length - 1];
    
    // Check for valid finish (must end on double)
    if (newScore < 0) {
      return {
        isValid: false,
        isBust: true,
        message: `Bust! Score too low. Score remains ${currentScore}.`,
        updatedScore: currentScore // Score stays the same
      };
    } 
    
    if (newScore === 0 && !lastDart.region.includes('Double') && !lastDart.region.includes('Bull')) {
      return {
        isValid: false,
        isBust: true,
        message: `Bust! Must finish on a double. Score remains ${currentScore}.`,
        updatedScore: currentScore // Score stays the same
      };
    } 
    
    if (newScore === 0) {
      return {
        isValid: true,
        isWin: true,
        message: `Game won by ${currentPlayer}!`,
        updatedScore: 0
      };
    }
    
    // Valid turn
    return {
      isValid: true,
      isWin: false,
      message: `${currentPlayer} scores ${turnTotal}. New score: ${newScore}`,
      updatedScore: newScore
    };
  }

  /**
   * Check if a score can be finished and provide a suggestion
   * @param {Number} score - Current score
   * @returns {Object|null} - Finish suggestion or null if not possible
   */
  getFinishSuggestion(score) {
    if (score <= 0 || score > 170) return null;

    // All possible dart values
    const singleValues = Array.from({length: 20}, (_, i) => i + 1).concat([25]); // 1-20 + bull
    const doubleValues = Array.from({length: 20}, (_, i) => (i + 1) * 2).concat([50]); // doubles + double bull
    const tripleValues = Array.from({length: 20}, (_, i) => (i + 1) * 3); // triples

    const allValues = [...singleValues, ...doubleValues, ...tripleValues];

    // 1 dart finish (must be double)
    for (let double of doubleValues) {
      if (score === double) {
        const number = double === 50 ? 'Bull' : (double / 2).toString();
        return {
          darts: 1,
          combination: [`Double ${number}`],
          description: `Finish with Double ${number}`
        };
      }
    }

    // 2 dart finishes
    for (let first of allValues) {
      const remaining = score - first;
      if (remaining > 0 && doubleValues.includes(remaining)) {
        const firstDesc = this.getValueDescription(first);
        const number = remaining === 50 ? 'Bull' : (remaining / 2).toString();
        return {
          darts: 2,
          combination: [firstDesc, `Double ${number}`],
          description: `${firstDesc} → Double ${number}`
        };
      }
    }

    // 3 dart finishes
    for (let first of allValues) {
      for (let second of allValues) {
        const remaining = score - first - second;
        if (remaining > 0 && doubleValues.includes(remaining)) {
          const firstDesc = this.getValueDescription(first);
          const secondDesc = this.getValueDescription(second);
          const number = remaining === 50 ? 'Bull' : (remaining / 2).toString();
          return {
            darts: 3,
            combination: [firstDesc, secondDesc, `Double ${number}`],
            description: `${firstDesc} → ${secondDesc} → Double ${number}`
          };
        }
      }
    }

    return null;
  }

  /**
   * Helper to get a descriptive name for a dart value
   * @param {Number} value - Dart value
   * @returns {String} - Description
   */
  getValueDescription(value) {
    if (value === 25) return 'Single Bull';
    if (value === 50) return 'Double Bull';
    
    // Check if it's a triple
    if (value % 3 === 0 && value <= 60 && value > 20) {
      return `Triple ${value / 3}`;
    }
    
    // Check if it's a double
    if (value % 2 === 0 && value <= 40 && value > 20) {
      return `Double ${value / 2}`;
    }
    
    // Single value
    return `Single ${value}`;
  }

  /**
   * Check if the game is over
   * @param {Object} scores - Current scores
   * @returns {String|null} - Winning player name or null if game is not over
   */
  checkWinner(scores) {
    for (const [player, score] of Object.entries(scores)) {
      if (score === 0) {
        return player;
      }
    }
    return null;
  }

  /**
   * Get game setup UI options
   * @returns {Array} - Array of game options
   */
  getGameOptions() {
    return [
      {
        id: '501',
        title: 'Classic 501',
        description: 'Start with 501 points, first to 0 wins. Must finish on double.',
        value: 501,
        color: 'blue'
      },
      {
        id: '301',
        title: 'Classic 301',
        description: 'Start with 301 points, first to 0 wins. Must finish on double.',
        value: 301,
        color: 'green'
      },
      {
        id: '201',
        title: 'Classic 201', 
        description: 'Start with 201 points, first to 0 wins. Must finish on double.',
        value: 201,
        color: 'purple'
      }
    ];
  }
}