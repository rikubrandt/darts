'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';

const Scoreboard = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players, currentPlayer, scores } = state;

  const resetGame = () => {
    dispatch({ type: ACTIONS.RESET_GAME });
    // Clear saved state from localStorage
    localStorage.removeItem('dart-game-state');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Scoreboard</h2>
      <div className="space-y-3">
        {players.map((player, index) => (
          <div
            key={player}
            className={`p-4 rounded-lg border-2 ${
              index === currentPlayer 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{player}</span>
              <span className="text-2xl font-bold text-blue-600">
                {scores[player]}
              </span>
            </div>
            {index === currentPlayer && (
              <div className="text-sm text-blue-600 mt-1">← Current Player</div>
            )}
          </div>
        ))}
      </div>
      
      <button
        onClick={resetGame}
        className="w-full mt-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Quit Game
      </button>
    </div>
  );
};

export default Scoreboard;