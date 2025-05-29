'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { GAME_MODES } from '../../game-modes';

const TargetDisplay = () => {
  const { state } = useGameContext();
  const { players, currentPlayer, scores, gameType } = state;
  
  // Only show for Around the Clock game
  if (gameType !== GAME_MODES.AROUND_THE_CLOCK) {
    return null;
  }
  
  const currentPlayerName = players[currentPlayer];
  const playerScore = scores[currentPlayerName];
  
  if (!playerScore) return null;
  
  const { currentTarget, continueTurn, gameOptions } = playerScore;
  
  // Get options from player's score
  const options = gameOptions || {};
  const doubleSkip = options.doubleSkip;
  const tripleSkip = options.tripleSkip;
  const skipOnMiss = options.skipOnMiss;
  const continueOnSuccess = options.continueOnSuccess;
  
  // Don't show if game is completed
  if (currentTarget > 20) {
    return null;
  }
  
  // Get target explanation based on game rules
  const getTargetExplanation = () => {
    let explanation = `Hit number ${currentTarget}`;
    
    if (doubleSkip && tripleSkip) {
      explanation += `. Double = skip to ${currentTarget + 2 - 1}, Triple = skip to ${currentTarget + 3 - 1}.`;
    } else if (doubleSkip) {
      explanation += `. Double = skip to ${currentTarget + 2 - 1}.`;
    } else if (tripleSkip) {
      explanation += `. Triple = skip to ${currentTarget + 3 - 1}.`;
    }
    
    if (continueOnSuccess) {
      explanation += ` Hit all 3 darts = keep throwing!`;
    }
    
    if (skipOnMiss) {
      explanation += ` Miss = lose your turn.`;
    }
    
    return explanation;
  };
  
  return (
    <div className="mb-4 p-4 bg-indigo-100 border border-indigo-400 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">
          🎯 Current Target
        </h3>
        <div className="flex items-center justify-center mb-2">
          <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold">
            {currentTarget}
          </div>
        </div>
        <p className="text-indigo-700 font-medium mt-2">
          {getTargetExplanation()}
        </p>
        
        {continueTurn && (
          <div className="mt-2 py-1 px-3 bg-green-100 text-green-800 font-bold rounded-full inline-block">
            🔥 Continue throwing!
          </div>
        )}

        <div className="mt-3 text-xs text-indigo-500">
          {`Game Mode: ${doubleSkip && tripleSkip ? 'Advanced' : continueOnSuccess ? 'Streak' : 'Standard'}`}
        </div>
      </div>
    </div>
  );
};

export default TargetDisplay;