'use client'
import { BaseGame } from './BaseGame';

/**
 * MultiplicationGame - Implementation for Multiplication dart game
 * 
 * Players throw 6 darts per turn in two sets of 3:
 * - First set: Factor set - try to hit the target number to build a multiplier
 * - Second set: Score set - score points which get multiplied by the factor
 * Each round progresses through numbers 1-20
 */
export class MultiplicationGame extends BaseGame {
  constructor(options = {}) {
    super();
    this.maxRounds = options.maxRounds || 20; // Default to 20 rounds (numbers 1-20)
    this.currentRound = 1;
  }

  /**
   * Initialize a new Multiplication game
   * @param {Array} players - Array of player names
   * @returns {Object} - Initial scores object
   */
  initializeGame(players) {
    const scores = {};
    players.forEach(player => {
      scores[player] = {
        totalScore: 0,
        currentRound: 1,
        targetNumber: 1,
        currentPhase: 'factor', // 'factor' or 'multiply'
        currentFactor: 0,
        roundScore: 0,
        dartSets: [], // Will store the two sets of darts for the current turn
        roundHistory: [] // Track all previous rounds
      };
    });
    return scores;
  }

  /**
   * Process a turn in Multiplication game
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

    // Deep copy current player's score to modify
    const playerScore = JSON.parse(JSON.stringify(scores[currentPlayer]));
    const { currentPhase, targetNumber } = playerScore;
    
    // Add the current darts to the player's dart sets for this turn
    playerScore.dartSets.push([...currentDarts]);
    
    let updatedMessage = '';
    
    if (currentPhase === 'factor') {
      // Calculate factor based on hits of the target number
      let factor = 0;
      
      // Check each dart to see if it hit the target number
      for (const dart of currentDarts) {
        // Extract the number from the region (e.g., "Single 5" -> 5)
        const match = dart.region.match(/\d+/);
        if (!match) continue;
        
        const hitNumber = parseInt(match[0], 10);
        
        // Special case for bullseye - always counts toward factor regardless of target
        if (dart.region.includes('Bull')) {
          if (dart.region.includes('Double')) {
            factor += 3; // Double bull = 3x
            updatedMessage += `Double Bull! Added 3x to factor. `;
          } else {
            factor += 2; // Single bull = 2x
            updatedMessage += `Single Bull! Added 2x to factor. `;
          }
          continue;
        }
        
        // Check if this dart hit the target number
        if (hitNumber === targetNumber) {
          if (dart.region.includes('Triple')) {
            factor += 3;
            updatedMessage += `Triple ${targetNumber}! Added 3x to factor. `;
          } else if (dart.region.includes('Double')) {
            factor += 2;
            updatedMessage += `Double ${targetNumber}! Added 2x to factor. `;
          } else {
            factor += 1;
            updatedMessage += `Single ${targetNumber}! Added 1x to factor. `;
          }
        }
      }
      
      // Update player's factor for this round
      playerScore.currentFactor = factor;
      
      // If factor is 0, skip the scoring phase and apply the penalty
      if (factor === 0) {
        // Divide total score by 2 immediately
        const newTotalScore = Math.floor(playerScore.totalScore / 2);
        updatedMessage += `Missed ${targetNumber} completely! No factor earned. Total score halved to ${newTotalScore}. `;
        
        // Save this round to history
        playerScore.roundHistory.push({
          targetNumber: playerScore.targetNumber,
          factor: 0,
          baseScore: 0,
          roundScore: 0,
          dartSets: [[...currentDarts]],
          penalty: true
        });
        
        // Update total score
        playerScore.totalScore = newTotalScore;
        
        // Move to next round
        const nextRound = playerScore.currentRound + 1;
        const nextTarget = nextRound <= 20 ? nextRound : 25; // Use bullseye for any extra rounds
        
        // Check if game is over
        const isGameOver = nextRound > this.maxRounds;
        
        if (!isGameOver) {
          // Set up for next round
          playerScore.currentRound = nextRound;
          playerScore.targetNumber = nextTarget;
          playerScore.currentPhase = 'factor';
          playerScore.currentFactor = 0;
          playerScore.dartSets = [];
        }
        
        return {
          isValid: true,
          isWin: isGameOver, // Game is over when all rounds are completed
          message: `${updatedMessage}${isGameOver ? ' Game complete!' : ` Moving to round ${nextRound}, target: ${nextTarget}.`}`,
          updatedScore: playerScore,
          continueTurn: false // End the turn, skip scoring phase
        };
      }
      
      // Move to the multiply phase (only if factor > 0)
      playerScore.currentPhase = 'multiply';
      
      return {
        isValid: true,
        isWin: false,
        message: `Factor of ${factor}x earned! ${updatedMessage} Throw your next 3 darts to score points.`,
        updatedScore: playerScore,
        // Special property for two-phase turns
        continueTurn: true
      };
      
    } else { // multiply phase
      // Calculate the base score from these darts
      const baseScore = currentDarts.reduce((sum, dart) => sum + dart.value, 0);
      
      // Apply the factor (if factor is 0, divide total score by 2)
      let roundScore = 0;
      let totalScore = playerScore.totalScore;
      
      if (playerScore.currentFactor > 0) {
        roundScore = baseScore * playerScore.currentFactor;
        totalScore += roundScore;
        updatedMessage += `Base score of ${baseScore} × factor of ${playerScore.currentFactor} = ${roundScore} points! `;
      } else {
        // Divide total score by 2 if factor is 0
        totalScore = Math.floor(totalScore / 2);
        updatedMessage += `No factor earned! Total score cut in half to ${totalScore}. `;
      }
      
      // Store the round score
      playerScore.roundScore = roundScore;
      
      // Save this round to history
      playerScore.roundHistory.push({
        targetNumber: playerScore.targetNumber,
        factor: playerScore.currentFactor,
        baseScore: baseScore,
        roundScore: roundScore,
        dartSets: [...playerScore.dartSets]
      });
      
      // Update total score
      playerScore.totalScore = totalScore;
      
      // Move to next round
      const nextRound = playerScore.currentRound + 1;
      const nextTarget = nextRound <= 20 ? nextRound : 25; // Use bullseye for any extra rounds
      
      // Check if game is over
      const isGameOver = nextRound > this.maxRounds;
      
      if (!isGameOver) {
        // Set up for next round
        playerScore.currentRound = nextRound;
        playerScore.targetNumber = nextTarget;
        playerScore.currentPhase = 'factor';
        playerScore.currentFactor = 0;
        playerScore.dartSets = [];
      }
      
      return {
        isValid: true,
        isWin: isGameOver, // Game is over when all rounds are completed
        message: `${updatedMessage}${isGameOver ? ' Game complete!' : ` Moving to round ${nextRound}, target: ${nextTarget}.`}`,
        updatedScore: playerScore,
        continueTurn: false // End the turn
      };
    }
  }

  /**
   * No finish suggestion for Multiplication Game
   */
  getFinishSuggestion() {
    return null;
  }

  /**
   * Check if the game is over
   * @param {Object} scores - Current scores
   * @returns {String|null} - Winning player name or null if game is not over
   */
  checkWinner(scores) {
    // Check if any player has completed all rounds
    const completedPlayers = [];
    
    for (const [player, score] of Object.entries(scores)) {
      if (score.currentRound > this.maxRounds) {
        completedPlayers.push({ player, score: score.totalScore });
      }
    }
    
    // If no players have completed, game is not over
    if (completedPlayers.length === 0) {
      return null;
    }
    
    // Find the player with the highest score among those who completed
    completedPlayers.sort((a, b) => b.score - a.score);
    return completedPlayers[0].player;
  }

  /**
   * Get game setup UI options
   * @returns {Array} - Array of game options
   */
  getGameOptions() {
    return [
      {
        id: 'multiplication-standard',
        title: 'Multiply Game: Standard',
        description: 'Hit target numbers to build a multiplier, then score points. Rounds 1-20.',
        value: { maxRounds: 20 },
        color: 'purple'
      },
      {
        id: 'multiplication-short',
        title: 'Multiply Game: Quick',
        description: 'Shorter version with only 10 rounds (numbers 1-10).',
        value: { maxRounds: 10 },
        color: 'blue'
      }
    ];
  }
}