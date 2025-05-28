'use client'
import { BaseGame } from './BaseGame';
import { X01Game } from './X01Game';

// Export available game modes
export const GAME_MODES = {
  X01: 'x01',
  // Add more game modes here as they are implemented
  // CRICKET: 'cricket',
  // AROUND_THE_CLOCK: 'around-the-clock',
};

/**
 * Factory function to get a game implementation based on type and options
 * @param {String} type - Game type identifier
 * @param {Object} options - Game options
 * @returns {BaseGame} - Game implementation instance
 */
export function getGameImplementation(type, options = {}) {
  switch (type) {
    case GAME_MODES.X01:
      return new X01Game(options.startingScore);
    // Add more game types as they are implemented
    // case GAME_MODES.CRICKET:
    //   return new CricketGame(options);
    default:
      throw new Error(`Unknown game type: ${type}`);
  }
}

/**
 * Get all available game modes for the selection screen
 * @returns {Array} - Array of game mode options
 */
export function getAllGameModes() {
  const games = [
    {
      type: GAME_MODES.X01,
      implementation: new X01Game(),
      options: new X01Game().getGameOptions(),
    },
    // Add more game types as they are implemented
    // {
    //   type: GAME_MODES.CRICKET,
    //   implementation: new CricketGame(),
    //   options: new CricketGame().getGameOptions(),
    // },
  ];
  
  return games;
}

export { BaseGame, X01Game };