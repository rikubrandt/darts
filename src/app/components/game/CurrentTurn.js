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
    
    // Get game implementation to process the turn
    const gameImpl = getGameImplementation(gameType, { 
      startingScore: gameMode === '501' ? 501 : gameMode === '301' ? 301 : 201 
    });
    
    // Process the turn
    const result = gameImpl.processTurn({
      scores,
      currentDarts,
      currentPlayer: playerName
    });
    
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
      
      // Next player
      dispatch({ 
        type: ACTIONS.SET_CURRENT_PLAYER, 
        payload: (currentPlayer + 1) % players.length 
      });
      dispatch({ type: ACTIONS.SET_CURRENT_DARTS, payload: [] });
    }
  };

  const turnTotal = currentDarts.reduce((sum, dart) => sum + dart.value, 0);

  return (
    <div className="mt-4 w-full max-w-sm">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-black mb-2">Current Turn:</h3>
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
          className="w-full mt-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next Player
        </button>
      </div>
    </div>
  );
};

export default CurrentTurn;