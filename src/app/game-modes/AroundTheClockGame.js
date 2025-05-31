'use client'
import { BaseGame } from './BaseGame';

/**
 * AroundTheClockGame - Implementation for Around the Clock dart game
 * 
 * Players must hit each number in sequence from 1-20.
 * First player to complete the sequence wins.
 */
export class AroundTheClockGame extends BaseGame {
  constructor(options = {}) {
    super();
    // Store the options directly on the instance
    this.doubleSkip = !!options.doubleSkip;
    this.tripleSkip = !!options.tripleSkip;
    this.skipOnMiss = !!options.skipOnMiss;
    this.continueOnSuccess = !!options.continueOnSuccess;
    
    console.log("Game options:", {
      doubleSkip: this.doubleSkip,
      tripleSkip: this.tripleSkip,
      skipOnMiss: this.skipOnMiss,
      continueOnSuccess: this.continueOnSuccess
    });
    
    this.sequence = Array.from({ length: 20 }, (_, i) => i + 1); // 1-20 by default
  }

  /**
   * Initialize a new Around the Clock game
   * @param {Array} players - Array of player names
   * @returns {Object} - Initial scores object
   */
  initializeGame(players) {
    const scores = {};
    players.forEach(player => {
      scores[player] = {
        currentTarget: 1, // Start at 1
        hitsInARow: 0, // Track consecutive hits
        misses: 0,     // Track total misses
        continueTurn: false, // Flag to indicate if player gets to continue
        gameOptions: {
          // Store the game options in the score object for reference
          doubleSkip: this.doubleSkip,
          tripleSkip: this.tripleSkip,
          skipOnMiss: this.skipOnMiss,
          continueOnSuccess: this.continueOnSuccess
        }
      };
    });
    return scores;
  }

  /**
   * Process a turn in Around the Clock game
   * @param {Object} params - Game parameters
   * @returns {Object} - Result with updated state information
   */
  processTurn({ scores, currentDarts, currentPlayer }) {
    console.log("Processing turn with options:", {
      doubleSkip: this.doubleSkip,
      tripleSkip: this.tripleSkip,
      skipOnMiss: this.skipOnMiss,
      continueOnSuccess: this.continueOnSuccess
    });
    
    if (currentDarts.length === 0) {
      return { 
        isValid: false, 
        message: 'No darts thrown' 
      };
    }

    // Deep copy current player's score to modify
    const playerScore = JSON.parse(JSON.stringify(scores[currentPlayer]));
    
    // Make sure we use the stored game options
    const options = playerScore.gameOptions || {
      doubleSkip: this.doubleSkip,
      tripleSkip: this.tripleSkip,
      skipOnMiss: this.skipOnMiss,
      continueOnSuccess: this.continueOnSuccess
    };
    
    let currentTarget = playerScore.currentTarget;
    let updatedMessage = '';
    let progressMade = false;
    let allDartsHit = true; // Track if all darts hit their targets
    
    console.log(`Player ${currentPlayer} starting turn at target: ${currentTarget}`);
    
    // Process each dart
    for (const dart of currentDarts) {
      console.log(`Processing dart:`, dart);
      
      // Extract the number hit from the region string
      const match = dart.region.match(/\d+/);
      if (!match) {
        allDartsHit = false;
        console.log("No number match found in region");
        continue; // Skip if not a numbered region (shouldn't happen)
      }
      
      const hitNumber = parseInt(match[0], 10);
      const isDouble = dart.region.includes('Double');
      const isTriple = dart.region.includes('Triple');
      
      console.log(`Hit number: ${hitNumber}, isDouble: ${isDouble}, isTriple: ${isTriple}, currentTarget: ${currentTarget}`);
      
      // Check if this dart hit the current target
      if (hitNumber === currentTarget) {
        // Calculate advancement based on hit type
        let advancement = 1; // Default advance by 1
        
        if (isTriple && options.tripleSkip) {
          advancement = 3; // Skip 2 numbers ahead on triple (move 3 total)
          updatedMessage += `Triple ${hitNumber}! Skip to ${currentTarget + advancement - 1}. `;
          console.log(`Triple hit! Advancing by ${advancement} to target ${currentTarget + advancement}`);
        } else if (isDouble && options.doubleSkip) {
          advancement = 2; // Skip 1 number ahead on double (move 2 total)
          updatedMessage += `Double ${hitNumber}! Skip to ${currentTarget + advancement - 1}. `;
          console.log(`Double hit! Advancing by ${advancement} to target ${currentTarget + advancement}`);
        } else {
          updatedMessage += `Hit ${hitNumber}! Moving to ${currentTarget + 1}. `;
          console.log(`Regular hit! Advancing by 1 to target ${currentTarget + 1}`);
        }
        
        // Advance target
        currentTarget += advancement;
        progressMade = true;
        
        // Check for win
        if (currentTarget > 20) {
          console.log(`Player ${currentPlayer} wins!`);
          return {
            isValid: true,
            isWin: true,
            message: `${currentPlayer} wins by completing the sequence!`,
            updatedScore: { 
              ...playerScore, 
              currentTarget: 21, // Ensure it's beyond the max for display purposes
              continueTurn: false, // End the game
              gameOptions: options
            }
          };
        }
      } else {
        // Miss
        playerScore.misses++;
        allDartsHit = false;
        
        console.log(`Missed target ${currentTarget}, hit ${hitNumber} instead`);
        
        if (options.skipOnMiss) {
          updatedMessage += `Missed ${currentTarget}, turn over. `;
          console.log(`Skip on miss enabled, ending turn`);
          break; // End processing darts on miss in skip mode
        } else {
          updatedMessage += `Missed ${currentTarget}, keep trying. `;
        }
      }
    }
    
    // Update the player score
    playerScore.currentTarget = currentTarget;
    playerScore.hitsInARow = allDartsHit ? playerScore.hitsInARow + 1 : 0;
    
    // Determine if player gets to continue their turn
    const shouldContinue = options.continueOnSuccess && allDartsHit && currentDarts.length === 3;
    playerScore.continueTurn = shouldContinue;
    
    console.log(`Turn results: progressMade=${progressMade}, continueTurn=${shouldContinue}, newTarget=${currentTarget}`);
    
    let resultMessage;
    if (progressMade) {
      resultMessage = `${currentPlayer} is now on number ${currentTarget}`;
      if (shouldContinue) {
        resultMessage += " and gets to continue throwing!";
      }
    } else {
      resultMessage = `${currentPlayer} missed target ${currentTarget}.`;
    }
    
    // Make sure to save the game options in the player score
    playerScore.gameOptions = options;
    
    return {
      isValid: true,
      isWin: false,
      message: resultMessage,
      updatedScore: playerScore,
      // Special property to indicate the player should continue
      continueTurn: shouldContinue
    };
  }

  /**
   * No finish suggestion for Around the Clock
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
    for (const [player, score] of Object.entries(scores)) {
      if (score.currentTarget > 20) {
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
        id: 'around-the-clock-standard',
        title: 'Clock Game: Standard',
        description: 'Hit numbers 1-20 in sequence. First to complete wins.',
        value: { 
          doubleSkip: false, 
          tripleSkip: false, 
          skipOnMiss: false,
          continueOnSuccess: false
        },
        color: 'indigo'
      },
      {
        id: 'around-the-clock-advanced',
        title: 'Clock Game: Pro Mode',
        description: 'Doubles and triples let you skip ahead! Three successful darts = keep throwing.',
        value: { 
          doubleSkip: true, 
          tripleSkip: true, 
          skipOnMiss: false,
          continueOnSuccess: true
        },
        color: 'teal'
      },
      {
        id: 'around-the-clock-streak',
        title: 'Clock Game: Streak Mode',
        description: 'Hit all 3 darts = keep throwing. Miss = turn over.',
        value: { 
          doubleSkip: false, 
          tripleSkip: false, 
          skipOnMiss: true,
          continueOnSuccess: true
        },
        color: 'pink'
      }
    ];
  }
}