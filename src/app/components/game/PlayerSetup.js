'use client'
import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { GAME_STATES } from '../../lib/constants';

const PlayerSetup = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players } = state;
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      dispatch({ 
        type: ACTIONS.ADD_PLAYER, 
        payload: newPlayerName.trim() 
      });
      setNewPlayerName('');
    }
  };

  const removePlayer = (index) => {
    dispatch({ 
      type: ACTIONS.REMOVE_PLAYER, 
      payload: index 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const continueToGameSelect = () => {
    dispatch({ 
      type: ACTIONS.SET_GAME_STATE, 
      payload: GAME_STATES.GAME_SELECT 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Dart Game Setup</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Players</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter player name"
              className="flex-1 p-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addPlayer}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </div>

        {players.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-black mb-2">Players:</h3>
            <ul className="space-y-1">
              {players.map((player, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{player}</span>
                  <button
                    onClick={() => removePlayer(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {players.length > 0 && (
          <button
            onClick={continueToGameSelect}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Continue to Game Selection
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerSetup;