'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { GAME_STATES } from '../../lib/constants';
import { getAllGameModes, getGameImplementation, GAME_MODES } from '../../game-modes';

const GameSelect = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players } = state;
  const allGameModes = getAllGameModes();

  const startGame = (gameType, gameMode, options) => {
    // Get the game implementation with all required options
    const gameImpl = getGameImplementation(gameType, options);
    
    // Initialize scores for all players
    const initialScores = gameImpl.initializeGame(players);
    
    // Update game state
    dispatch({ type: ACTIONS.SET_SCORES, payload: initialScores });
    dispatch({ 
      type: ACTIONS.SET_GAME_MODE, 
      payload: { type: gameType, mode: gameMode } 
    });
    dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PLAYING });
    dispatch({ type: ACTIONS.SET_CURRENT_PLAYER, payload: 0 });
    dispatch({ type: ACTIONS.SET_CURRENT_DARTS, payload: [] });
  };

  const goBackToSetup = () => {
    dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.SETUP });
  };

  // Custom button color mapping function - ensures proper Tailwind colors
  const getButtonColor = (color) => {
    const colorMap = {
      'blue': 'bg-blue-500 hover:bg-blue-600 ring-blue-500',
      'green': 'bg-green-500 hover:bg-green-600 ring-green-500',
      'purple': 'bg-purple-500 hover:bg-purple-600 ring-purple-500',
      'indigo': 'bg-indigo-500 hover:bg-indigo-600 ring-indigo-500',
      'teal': 'bg-teal-500 hover:bg-teal-600 ring-teal-500',
      'pink': 'bg-pink-500 hover:bg-pink-600 ring-pink-500',
      'red': 'bg-red-500 hover:bg-red-600 ring-red-500',
      'yellow': 'bg-yellow-500 hover:bg-yellow-600 ring-yellow-500',
      'orange': 'bg-orange-500 hover:bg-orange-600 ring-orange-500'
    };
    
    return colorMap[color] || 'bg-gray-500 hover:bg-gray-600 ring-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Select Game Mode</h1>
        
        <div className="space-y-6">
          {allGameModes.map((gameMode) => (
            <div key={gameMode.type} className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-2">
                {gameMode.type === GAME_MODES.X01 ? '01 Games' : 
                 gameMode.type === GAME_MODES.AROUND_THE_CLOCK ? 'Around the Clock' : 
                 'Other Games'}
              </h2>
              
              {gameMode.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => startGame(gameMode.type, option.id, option.value)}
                  className={`w-full p-4 ${getButtonColor(option.color)} text-white rounded-lg focus:outline-none focus:ring-2`}
                >
                  <div className="text-xl font-bold">{option.title}</div>
                  <div className="text-sm">{option.description}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
        
        <button
          onClick={goBackToSetup}
          className="w-full mt-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Setup
        </button>
      </div>
    </div>
  );
};

export default GameSelect;