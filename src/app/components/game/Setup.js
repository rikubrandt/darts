'use client'
import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { GAME_STATES } from '../../lib/constants';
import { getAllGameModes, getGameImplementation, GAME_MODES } from '../../game-modes';

const CombinedSetup = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { players } = state;
  const [newPlayerName, setNewPlayerName] = useState('');
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  
  const allGameModes = getAllGameModes();
  
  // Flatten all game options into a single array for simpler selection
  const allGameOptions = allGameModes.flatMap(gameMode => 
    gameMode.options.map(option => ({
      gameType: gameMode.type,
      ...option
    }))
  );

  // Player management functions
  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    
    // Check if the name is empty
    if (!trimmedName) {
      return;
    }
    
    // Check for duplicate names (case insensitive)
    const nameExists = players.some(
      player => player.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (nameExists) {
      setError('A player with this name already exists');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Add the player
    dispatch({ 
      type: ACTIONS.ADD_PLAYER, 
      payload: trimmedName 
    });
    
    // Clear the input
    setNewPlayerName('');
  };

  const removePlayer = (index) => {
    dispatch({ 
      type: ACTIONS.REMOVE_PLAYER, 
      payload: index 
    });
    
    // Clear error when removing a player
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const selectGame = (game) => {
    setSelectedGame(game);
  };

  const startGame = () => {
    if (!selectedGame || players.length === 0) return;
    
    // Get the game implementation
    const gameImpl = getGameImplementation(selectedGame.gameType, selectedGame.value);
    
    // Initialize scores for all players
    const initialScores = gameImpl.initializeGame(players);
    
    // Update game state
    dispatch({ type: ACTIONS.SET_SCORES, payload: initialScores });
    dispatch({ 
      type: ACTIONS.SET_GAME_MODE, 
      payload: { type: selectedGame.gameType, mode: selectedGame.id } 
    });
    dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PLAYING });
    dispatch({ type: ACTIONS.SET_CURRENT_PLAYER, payload: 0 });
    dispatch({ type: ACTIONS.SET_CURRENT_DARTS, payload: [] });
  };

  // Get color class for game button
  const getColorClass = (color, isSelected) => {
    const baseColors = {
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'purple': 'bg-purple-500',
      'indigo': 'bg-indigo-500',
      'teal': 'bg-teal-500',
      'pink': 'bg-pink-500',
      'red': 'bg-red-500'
    };
    
    const baseColor = baseColors[color] || 'bg-gray-500';
    
    if (isSelected) {
      return `${baseColor} ring-4 ring-opacity-50 ring-white`;
    }
    
    return baseColor;
  };

  // Check if we can start the game
  const canStartGame = players.length > 0 && selectedGame !== null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Dart Game Setup</h1>
        
        {/* Player Setup Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Add Players</h2>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => {
                setNewPlayerName(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyPress}
              placeholder="Player name"
              className={`flex-1 p-2 border ${error ? 'border-red-500' : 'border-gray-300'} text-black rounded-lg`}
            />
            <button
              onClick={addPlayer}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            >
              Add
            </button>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}

          {players.length > 0 && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Players:</h3>
                <span className="text-sm text-gray-500">{players.length} player(s)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {players.map((player, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span className="mr-2">{player}</span>
                    <button
                      onClick={() => removePlayer(index)}
                      className="text-red-500 hover:text-red-700 text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Game Selection Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Select Game</h2>
          
          <div className="grid grid-cols-1 gap-2">
            {allGameOptions.map((game) => {
              const isSelected = selectedGame?.id === game.id;
              
              // Get the game type name for display
              const gameTypeName = {
                [GAME_MODES.X01]: '01 Game',
                [GAME_MODES.AROUND_THE_CLOCK]: 'Clock Game',
                [GAME_MODES.MULTIPLICATION]: 'Multiplication Game'
              }[game.gameType] || '';
              
              return (
                <button
                  key={game.id}
                  onClick={() => selectGame(game)}
                  className={`w-full p-3 ${getColorClass(game.color, isSelected)} text-white rounded-lg text-left`}
                >
                  <div className="flex justify-between">
                    <div className="font-bold">{game.title}</div>
                  </div>
                  <div className="text-xs text-white text-opacity-90">{game.description}</div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Start Game Button */}
        <button
          onClick={startGame}
          disabled={!canStartGame}
          className={`w-full py-4 rounded-lg text-white text-lg font-bold shadow-md ${
            canStartGame 
              ? 'bg-green-500 hover:bg-green-600 active:bg-green-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {!players.length 
            ? 'Add Players to Start' 
            : !selectedGame 
              ? 'Select a Game to Start' 
              : 'Start Game'}
        </button>
      </div>
    </div>
  );
};

export default CombinedSetup;