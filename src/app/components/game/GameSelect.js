'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { GAME_STATES } from '../../lib/constants';
import { getAllGameModes, getGameImplementation, GAME_MODES } from '../../game-modes';

const GameSelect = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players } = state;
  const allGameModes = getAllGameModes();

  const startGame = (gameType, gameMode, startingScore) => {
    // Get the game implementation
    const gameImpl = getGameImplementation(gameType, { startingScore });
    
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Select Game Mode</h1>
        
        <div className="space-y-6">
          {allGameModes.map((gameMode) => (
            <div key={gameMode.type} className="space-y-3">
              {gameMode.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => startGame(gameMode.type, option.id, option.value)}
                  className={`w-full p-4 bg-${option.color}-500 text-white rounded-lg hover:bg-${option.color}-600 focus:outline-none focus:ring-2 focus:ring-${option.color}-500`}
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