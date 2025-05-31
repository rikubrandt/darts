'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';

const MultiplicationScoreboard = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players, currentPlayer, scores } = state;

  const resetGame = () => {
    dispatch({ type: ACTIONS.RESET_GAME });
    // Clear saved state from localStorage
    localStorage.removeItem('dart-game-state');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Multiplication Game</h2>
      <div className="space-y-4">
        {players.map((player, index) => {
          const playerScore = scores[player] || { 
            totalScore: 0, 
            currentRound: 1,
            targetNumber: 1,
            currentPhase: 'factor',
            currentFactor: 0
          };
          
          const isCurrentTurn = index === currentPlayer;
          const maxRounds = 20; // TODO: Get this from game options
          const progress = ((playerScore.currentRound - 1) / maxRounds) * 100;
          
          return (
            <div
              key={player}
              className={`p-4 rounded-lg border-2 ${
                isCurrentTurn 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-lg">{player}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {playerScore.totalScore}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Round {playerScore.currentRound}/{maxRounds}</span>
                <span>Target: {playerScore.targetNumber}</span>
              </div>
              
              {isCurrentTurn && (
                <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                  <h4 className="font-medium text-blue-800">Current Turn</h4>
                  {playerScore.currentPhase === 'factor' ? (
                    <div className="text-sm mt-1">
                      <p>Phase: <span className="font-semibold text-purple-700">Building Factor</span></p>
                      <p>Hit <span className="font-bold">{playerScore.targetNumber}</span> to build your multiplier!</p>
                      <p className="text-xs mt-1 text-gray-600">
                        Single = 1x, Double = 2x, Triple = 3x
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm mt-1">
                      <p>Phase: <span className="font-semibold text-green-700">Scoring</span></p>
                      <p>Current Factor: <span className="font-bold">{playerScore.currentFactor || 'None (score will be halved)'}</span></p>
                      <p className="text-xs mt-1 text-gray-600">
                        {playerScore.currentFactor > 0 
                          ? `All points will be multiplied by ${playerScore.currentFactor}` 
                          : 'Warning: No factor earned! Your total score will be halved!'}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Recent rounds history (show last 3 rounds) */}
              {playerScore.roundHistory && playerScore.roundHistory.length > 0 && (
                <div className="mt-3 text-xs">
                  <h4 className="font-medium text-gray-700">Recent Rounds:</h4>
                  <div className="mt-1 space-y-1">
                    {playerScore.roundHistory.slice(-3).reverse().map((round, i) => (
                      <div 
                        key={i} 
                        className={`flex justify-between p-1 rounded ${round.penalty ? 'bg-red-50' : 'bg-gray-50'}`}
                      >
                        <span>#{playerScore.currentRound - i - 1}: Target {round.targetNumber}</span>
                        <span className={`font-medium ${round.penalty ? 'text-red-600' : ''}`}>
                          {round.penalty 
                            ? 'Score halved!' 
                            : round.factor > 0 
                              ? `${round.baseScore} × ${round.factor} = ${round.roundScore}` 
                              : 'Score halved'}
                        </span>
                      </div>
                    ))}
                  </div>
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

export default MultiplicationScoreboard;