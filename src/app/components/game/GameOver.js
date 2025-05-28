'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { getGameImplementation } from '../../game-modes';

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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Game Over!</h1>
        <h2 className="text-2xl font-semibold mb-6">🎉 {winner} Wins! 🎉</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Final Scores:</h3>
          {players.map(player => (
            <div key={player} className="flex justify-between p-2 bg-gray-50 rounded mb-1">
              <span>{player}</span>
              <span className={scores[player] === 0 ? 'text-green-600 font-bold' : ''}>
                {scores[player]}
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