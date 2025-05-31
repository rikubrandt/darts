'use client'
import { BaseGame } from './BaseGame';
import { X01Game } from './X01Game';
import { AroundTheClockGame } from './AroundTheClockGame';
import { MultiplicationGame } from './MultiplicationGame';

// Export available game modes
export const GAME_MODES = {
  X01: 'x01',
  AROUND_THE_CLOCK: 'around-the-clock',
  MULTIPLICATION: 'multiplication',
  // Add more game modes here as they are implemented
  // CRICKET: 'cricket',
};

/**
 * Factory function to get a game implementation based on type and options
 * @param {String} type - Game type identifier
 * @param {Object} options - Game options
 * @returns {BaseGame} - Game implementation instance
 */
export function getGameImplementation(type, options = {}) {
  console.log(`Creating game implementation for ${type} with options:`, options);
  
  switch (type) {
    case GAME_MODES.X01:
      // For X01 games, the startingScore is the main option
      return new X01Game(options.startingScore || 501);
      
    case GAME_MODES.AROUND_THE_CLOCK:
      // For Around the Clock, pass all options for special game modes
      const clockGame = new AroundTheClockGame({
        doubleSkip: !!options.doubleSkip,
        tripleSkip: !!options.tripleSkip,
        skipOnMiss: !!options.skipOnMiss,
        continueOnSuccess: !!options.continueOnSuccess
      });
      
      console.log("Created Around the Clock game with options:", {
        doubleSkip: clockGame.doubleSkip,
        tripleSkip: clockGame.tripleSkip,
        skipOnMiss: clockGame.skipOnMiss,
        continueOnSuccess: clockGame.continueOnSuccess
      });
      
      return clockGame;
      
    case GAME_MODES.MULTIPLICATION:
      // For Multiplication game
      return new MultiplicationGame({
        maxRounds: options.maxRounds || 20
      });

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
    {
      type: GAME_MODES.AROUND_THE_CLOCK,
      implementation: new AroundTheClockGame(),
      options: new AroundTheClockGame().getGameOptions(),
    },
    {
      type: GAME_MODES.MULTIPLICATION,
      implementation: new MultiplicationGame(),
      options: new MultiplicationGame().getGameOptions(),
    }
  ];
  
  return games;
}

export { BaseGame, X01Game, AroundTheClockGame, MultiplicationGame };