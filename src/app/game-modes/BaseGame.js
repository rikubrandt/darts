'use client'
/**
 * BaseGame - Abstract base class for all dart game implementations
 * 
 * This class defines the interface that all game implementations must follow.
 * Each game type (X01, Cricket, etc.) will extend this class and implement
 * these methods according to their specific rules.
 */
export class BaseGame {
  /**
   * Initialize a new game
   * @param {Array} players - Array of player names
   * @returns {Object} - Initial scores object
   */
  initializeGame(players) {
    throw new Error('initializeGame must be implemented by subclass');
  }

  /**
   * Process a turn and update scores
   * @param {Object} params - Game parameters
   * @param {Object} params.scores - Current scores
   * @param {Array} params.currentDarts - Array of darts thrown in current turn
   * @param {String} params.currentPlayer - Current player name
   * @returns {Object} - Result object with updated state information
   */
  processTurn({ scores, currentDarts, currentPlayer }) {
    throw new Error('processTurn must be implemented by subclass');
  }

  /**
   * Check if a score can be finished and provide a suggestion
   * @param {Number} score - Current score
   * @returns {Object|null} - Finish suggestion or null if not possible
   */
  getFinishSuggestion(score) {
    throw new Error('getFinishSuggestion must be implemented by subclass');
  }

  /**
   * Check if the game is over
   * @param {Object} scores - Current scores
   * @returns {String|null} - Winning player name or null if game is not over
   */
  checkWinner(scores) {
    throw new Error('checkWinner must be implemented by subclass');
  }

  /**
   * Get game setup UI options
   * @returns {Array} - Array of game options with title, description, and value
   */
  getGameOptions() {
    throw new Error('getGameOptions must be implemented by subclass');
  }
}