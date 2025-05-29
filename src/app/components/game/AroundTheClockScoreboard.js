'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';

const AroundTheClockScoreboard = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players, currentPlayer, scores, gameMode } = state;

  const resetGame = () => {
    dispatch({ type: ACTIONS.RESET_GAME });
    // Clear saved state from localStorage
    localStorage.removeItem('dart-game-state');
  };

  // Helper to render the progress bar
  const renderProgressBar = (current) => {
    const percentage = Math.min(((current - 1) / 20) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Helper to render the target bubbles
  const renderTargetBubbles = (currentTarget) => {
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
          // Determine the status of each number
          const isComplete = num < currentTarget;
          const isCurrent = num === currentTarget;
          
          // Set the class based on status
          let bubbleClass = "w-5 h-5 rounded-full text-xs flex items-center justify-center ";
          
          if (isComplete) {
            bubbleClass += "bg-green-500 text-white";
          } else if (isCurrent) {
            bubbleClass += "bg-blue-500 text-white font-bold ring-2 ring-blue-300";
          } else {
            bubbleClass += "bg-gray-200 text-gray-600";
          }
          
          return (
            <div key={num} className={bubbleClass}>
              {num}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Around the Clock</h2>
      <div className="space-y-4">
        {players.map((player, index) => {
          const playerScore = scores[player] || { currentTarget: 1, hitsInARow: 0, misses: 0, continueTurn: false };
          
          return (
            <div
              key={player}
              className={`p-4 rounded-lg border-2 ${
                index === currentPlayer 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-lg">{player}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {playerScore.currentTarget > 20 ? 'WINNER!' : playerScore.currentTarget}
                </span>
              </div>
              
              {/* Progress bar */}
              {renderProgressBar(playerScore.currentTarget)}
              
              {/* Target bubbles */}
              {renderTargetBubbles(playerScore.currentTarget)}
              
              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <span>Progress: {Math.min(playerScore.currentTarget - 1, 20)}/20</span>
                <span>Misses: {playerScore.misses}</span>
              </div>
              
              {index === currentPlayer && (
                <div className={`text-sm mt-2 ${playerScore.continueTurn ? 'text-green-600 font-bold' : 'text-blue-600'}`}>
                  {playerScore.continueTurn 
                    ? "🎯 Continue throwing!" 
                    : "← Current Player"}
                </div>
              )}
            </div>
          );
        })}
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


export default AroundTheClockScoreboard;