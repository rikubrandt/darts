'use client'
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { GAME_MODES } from '../../game-modes';

const MultiplicationTargetDisplay = () => {
  const { state } = useGameContext();
  const { players, currentPlayer, scores, gameType } = state;
  
  // Only show for Multiplication game
  if (gameType !== GAME_MODES.MULTIPLICATION) {
    return null;
  }
  
  const currentPlayerName = players[currentPlayer];
  const playerScore = scores[currentPlayerName];
  
  if (!playerScore) return null;
  
  const { 
    targetNumber, 
    currentPhase, 
    currentFactor,
    currentRound
  } = playerScore;
  
  // Generate explanation based on current phase
  const getExplanation = () => {
    if (currentPhase === 'factor') {
      return (
        <div className="mt-2">
          <p className="text-purple-700 font-medium">
            Hit number {targetNumber} to build your factor
          </p>
          <div className="grid grid-cols-3 gap-1 mt-2 text-sm">
            <div className="bg-purple-100 p-1 rounded">Single = 1×</div>
            <div className="bg-purple-100 p-1 rounded">Double = 2×</div>
            <div className="bg-purple-100 p-1 rounded">Triple = 3×</div>
          </div>
          <div className="mt-1 bg-yellow-100 p-2 rounded text-sm">
            <span className="font-medium">Bullseye always counts!</span>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div className="p-1">Bull = 2×</div>
              <div className="p-1">Double Bull = 3×</div>
            </div>
          </div>
          <p className="text-sm mt-2 text-red-600 font-medium">
            Miss all shots = Score halved & skip to next round!
          </p>
        </div>
      );
    } else {
      // This shouldn't actually display now since we skip the multiply phase
      // when factor is 0, but keeping it for completeness
      return (
        <div className="mt-2">
          <p className="text-green-700 font-medium">
            Throw to score points
          </p>
          <p className="text-lg font-bold mt-1">
            {currentFactor > 0 
              ? `All points × ${currentFactor}!` 
              : 'Warning: No factor! Your score will be halved!'}
          </p>
          <p className="text-sm mt-2 text-gray-600">
            {currentFactor > 0 
              ? 'Aim for high-value areas to maximize your score' 
              : 'Better luck on the next round!'}
          </p>
        </div>
      );
    }
  };
  
  const getPhaseIcon = () => {
    if (currentPhase === 'factor') {
      return '🎯';
    } else {
      return currentFactor > 0 ? '✖️' : '⚠️';
    }
  };
  
  return (
    <div className={`mb-4 p-4 ${
      currentPhase === 'factor' 
        ? 'bg-purple-100 border-purple-300' 
        : currentFactor > 0 
          ? 'bg-green-100 border-green-300' 
          : 'bg-red-100 border-red-300'
    } border rounded-lg`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {getPhaseIcon()} Round {currentRound}: {currentPhase === 'factor' ? 'Factor Phase' : 'Scoring Phase'}
        </h3>
        
        {currentPhase === 'factor' && (
          <div className="flex items-center justify-center mb-2">
            <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold">
              {targetNumber}
            </div>
          </div>
        )}
        
        {currentPhase === 'multiply' && (
          <div className="flex items-center justify-center mb-2">
            <div className={`${
              currentFactor > 0 ? 'bg-green-600' : 'bg-red-600'
            } text-white px-4 py-2 rounded-lg flex items-center justify-center text-2xl font-bold`}>
              {currentFactor > 0 ? `${currentFactor}×` : 'No Factor!'}
            </div>
          </div>
        )}
        
        {getExplanation()}
      </div>
    </div>
  );
};

export default MultiplicationTargetDisplay;