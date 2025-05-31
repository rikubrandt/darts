'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { getGameImplementation, GAME_MODES } from '../../game-modes';

const GameOver = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players, scores, gameType } = state;
  
  // Get the game implementation to find the winner
  const gameImpl = getGameImplementation(gameType);
  const winner = gameImpl.checkWinner(scores);

  const resetGame = () => {
    dispatch({ type: ACTIONS.RESET_GAME });
    // Clear saved state from localStorage
    localStorage.removeItem('dart-game-state');
  };
  
  // Helper function to display score appropriately based on game type
  const renderPlayerScore = (player) => {
    const score = scores[player];
    
    if (!score) return "N/A";
    
    // For X01 games, the score is a simple number
    if (gameType === GAME_MODES.X01) {
      return score;
    }
    
    // For Around the Clock, show current target or "Winner!"
    if (gameType === GAME_MODES.AROUND_THE_CLOCK) {
      return score.currentTarget > 20 ? "Winner!" : `Target: ${score.currentTarget}`;
    }
    
    // For Multiplication Game, show the total score
    if (gameType === GAME_MODES.MULTIPLICATION) {
      return score.totalScore;
    }
    
    // For other game types, try to stringify or return a fallback
    if (typeof score === 'object') {
      try {
        // Try to find a main score property to display
        if (score.points !== undefined) return score.points;
        if (score.total !== undefined) return score.total;
        if (score.totalScore !== undefined) return score.totalScore;
        if (score.currentTarget !== undefined) return `Target: ${score.currentTarget}`;
        
        // Fallback to simple text
        return player === winner ? "Winner!" : "Finished";
      } catch (e) {
        return "Score unavailable";
      }
    }
    
    // Default fallback
    return String(score);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Game Over!</h1>
        <h2 className="text-2xl font-semibold mb-6">🎉 {winner} Wins! 🎉</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Final Results:</h3>
          {players.map(player => (
            <div key={player} className="flex justify-between p-2 bg-gray-50 rounded mb-1">
              <span>{player}</span>
              <span className={player === winner ? 'text-green-600 font-bold' : ''}>
                {renderPlayerScore(player)}
              </span>
            </div>
          ))}
        </div>
        
        <button
          onClick={resetGame}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;