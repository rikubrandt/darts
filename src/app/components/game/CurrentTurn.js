'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { getGameImplementation } from '../../game-modes';

const CurrentTurn = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { 
    currentDarts, 
    editingIndex,
    currentPlayer,
    players,
    scores,
    gameType,
    gameMode
  } = state;

  const removeDart = (index) => {
    dispatch({ type: ACTIONS.REMOVE_DART, payload: index });
    if (editingIndex === index) {
      dispatch({ type: ACTIONS.SET_EDITING_INDEX, payload: null });
    }
  };

  const editDart = (index) => {
    dispatch({ type: ACTIONS.SET_EDITING_INDEX, payload: index });
  };

  const submitTurn = () => {
    if (currentDarts.length === 0 || editingIndex !== null) return;
    
    const playerName = players[currentPlayer];
    const playerScore = scores[playerName];
    
    // Get all necessary options from the player's score
    const gameOptions = playerScore?.gameOptions || {};
    
    // Log for debugging
    console.log("Submitting turn:", { 
      gameType, 
      gameMode, 
      playerName, 
      currentDarts,
      gameOptions
    });
    
    // Get game implementation to process the turn
    const gameImpl = getGameImplementation(gameType, gameOptions);
    
    // Process the turn
    const result = gameImpl.processTurn({
      scores,
      currentDarts,
      currentPlayer: playerName
    });
    
    console.log("Turn result:", result);
    
    if (!result.isValid) {
      // Bust or invalid
      if (result.isBust) {
        dispatch({ 
          type: ACTIONS.SHOW_BUST_MODAL, 
          payload: result.message 
        });
      }
      dispatch({ type: ACTIONS.SET_CURRENT_DARTS, payload: [] });
    } else if (result.isWin) {
      // Winner!
      dispatch({ 
        type: ACTIONS.UPDATE_SCORE, 
        payload: { player: playerName, score: result.updatedScore } 
      });
      dispatch({ type: ACTIONS.SET_GAME_STATE, payload: 'gameOver' });
    } else {
      // Valid turn
      dispatch({ 
        type: ACTIONS.UPDATE_SCORE, 
        payload: { player: playerName, score: result.updatedScore } 
      });
      
      // Check if player gets to continue (specific to games like Around the Clock)
      if (result.continueTurn) {
        console.log("Player continues their turn!");
        // Clear darts but keep the same player
        dispatch({ type: ACTIONS.SET_CURRENT_DARTS, payload: [] });
      } else {
        // Next player
        console.log("Moving to next player");
        dispatch({ 
          type: ACTIONS.SET_CURRENT_PLAYER, 
          payload: (currentPlayer + 1) % players.length 
        });
        dispatch({ type: ACTIONS.SET_CURRENT_DARTS, payload: [] });
      }
    }
  };

  const turnTotal = currentDarts.reduce((sum, dart) => sum + dart.value, 0);
  
  // Check if current player gets to continue their turn
  const isContinuing = scores[players[currentPlayer]]?.continueTurn;

  return (
    <div className="mt-4 w-full max-w-sm">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-black mb-2">
          {isContinuing ? 
            <span className="flex items-center text-green-600">
              <span className="mr-2">🔥</span> Continue Your Turn
            </span> : 
            "Current Turn:"}
        </h3>
        <div className="space-y-1">
          {/* Current darts list */}
          {currentDarts.map((dart, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-black">
                Dart {index + 1}: <strong>{dart.region} ({dart.value})</strong>
              </span>

              <div className="flex gap-2">
                {/* edit */}
                <button
                  title="Replace this dart"
                  onClick={() => editDart(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✎
                </button>

                {/* delete */}
                <button
                  title="Remove this dart"
                  onClick={() => removeDart(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* empty rows so the card always shows 3 lines */}
          {Array.from({ length: 3 - currentDarts.length }).map((_, i) => (
            <div key={`empty-${i}`} className="flex justify-between text-sm text-black">
              <span>Dart {currentDarts.length + i + 1}:</span>
              <span>-</span>
            </div>
          ))}

          {/* hint while editing */}
          {editingIndex !== null && (
            <p className="mt-2 text-xs text-blue-600 text-center">
              Click a segment on the board to replace Dart&nbsp;{editingIndex + 1}
            </p>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between font-semibold">
            <span>Turn Total:</span>
            <span>{turnTotal}</span>
          </div>
        </div>
        
        <button
          onClick={submitTurn}
          disabled={currentDarts.length === 0 || editingIndex !== null}
          className={`w-full mt-3 py-2 ${isContinuing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isContinuing ? 'Continue Throwing' : 'Next Player'}
        </button>
      </div>
    </div>
  );
};

export default CurrentTurn;