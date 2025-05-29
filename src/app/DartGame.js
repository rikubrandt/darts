'use client'
import React from 'react';
import { GameProvider, useGameContext } from './context/GameContext';
import { GAME_STATES } from './lib/constants';
import { Dartboard } from './components/dartboard';
import {
  CurrentTurn,
  FinishSuggestion,
  GameOver,
  GameSelect,
  PlayerSetup,
  Scoreboard,
  AroundTheClockScoreboard,
  TargetDisplay
} from './components/game';

// Modal for showing bust messages
const BustModal = () => {
  const { state } = useGameContext();
  const { showBustModal, bustMessage } = state;

  if (!showBustModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg text-center">
        <p className="text-xl font-bold">{bustMessage}</p>
      </div>
    </div>
  );
};

// Game content based on current game state
const GameContent = () => {
  const { state } = useGameContext();
  const { gameState, players, gameMode } = state;

  switch (gameState) {
    case GAME_STATES.SETUP:
      return <PlayerSetup />;
    
    case GAME_STATES.GAME_SELECT:
      return <GameSelect />;
    
    case GAME_STATES.GAME_OVER:
      return <GameOver />;
    
    case GAME_STATES.PLAYING:
      return (
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Game-specific displays */}
            {state.gameType === 'x01' && <FinishSuggestion />}
            {state.gameType === 'around-the-clock' && <TargetDisplay />}

            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{gameMode} Game</h1>
              <div className="text-xl mt-2">
                <span className="font-semibold text-blue-600">{players[state.currentPlayer]}'s Turn</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dartboard */}
              <div className="flex flex-col items-center">
                <Dartboard />
                <CurrentTurn />
              </div>

              {/* Scoreboard - different for each game type */}
              {state.gameType === 'around-the-clock' ? (
                <AroundTheClockScoreboard />
              ) : (
                <Scoreboard />
              )}
            </div>
          </div>
          
          {/* Bust Modal */}
          <BustModal />
        </div>
      );
    
    default:
      return <div>Unknown game state</div>;
  }
};

// Main component
const DartGame = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default DartGame;