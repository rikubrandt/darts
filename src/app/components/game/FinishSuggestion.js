'use client'
import React, { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { getGameImplementation } from '../../game-modes';

const FinishSuggestion = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { 
    gameState,
    players,
    currentPlayer,
    scores,
    gameType,
    finishSuggestion,
    gameMode
  } = state;

  // Update finish suggestion when current player or scores change
  useEffect(() => {
    if (gameState === 'playing' && players.length > 0) {
      const currentPlayerName = players[currentPlayer];
      const currentScore = scores[currentPlayerName];
      
      // Get game implementation to get finish suggestion
      const gameImpl = getGameImplementation(gameType, { 
        startingScore: gameMode === '501' ? 501 : gameMode === '301' ? 301 : 201 
      });
      
      const suggestion = gameImpl.getFinishSuggestion(currentScore);
      dispatch({ type: ACTIONS.SET_FINISH_SUGGESTION, payload: suggestion });
    }
  }, [gameState, currentPlayer, scores, players, gameType, gameMode, dispatch, ACTIONS]);

  if (!finishSuggestion) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          🎯 Possible Finish for {players[currentPlayer]}
        </h3>
        <p className="text-yellow-700 font-medium">
          {scores[players[currentPlayer]]} points can be finished in {finishSuggestion.darts} dart
          {finishSuggestion.darts > 1 ? 's' : ''}:
        </p>
        <p className="text-yellow-800 text-lg font-bold mt-1">
          {finishSuggestion.description}
        </p>
      </div>
    </div>
  );
};

export default FinishSuggestion;