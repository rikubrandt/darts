'use client'
import React, { useState, useEffect } from 'react';
import { GameProvider, useGameContext } from './context/GameContext';
import { GAME_STATES } from './lib/constants';
import { GAME_MODES, getAllGameModes } from './game-modes';
import { Dartboard } from './components/dartboard';
import {
  CurrentTurn,
  FinishSuggestion,
  GameOver,
  GameSelect,
  PlayerSetup,
  CombinedSetup,
  Scoreboard,
  AroundTheClockScoreboard,
  TargetDisplay,
  MultiplicationScoreboard,
  MultiplicationTargetDisplay
} from './components/game';

// Flatten all game options - this is outside any component
// so it's calculated once at module load time
const ALL_GAME_OPTIONS = getAllGameModes().flatMap(gameMode => 
  gameMode.options.map(option => ({
    gameType: gameMode.type,
    ...option
  }))
);

// Helper function to get game title from ID
const getGameTitle = (gameId) => {
  const gameOption = ALL_GAME_OPTIONS.find(option => option.id === gameId);
  return gameOption?.title || gameId;
};

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
  // Using useState + useEffect to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const { state } = useGameContext();
  
  // Wait until client-side rendering before showing dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If we're still server-side rendering, show a simple loading state
  // This prevents hydration mismatches
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center">Loading Dart Game...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Now we're client-side, we can use the real state
  const { gameState, players } = state;

  switch (gameState) {
    case GAME_STATES.SETUP:
      return <CombinedSetup />;
    
    case GAME_STATES.GAME_SELECT:
      return <GameSelect />;
    
    case GAME_STATES.GAME_OVER:
      return <GameOver />;
    
    case GAME_STATES.PLAYING:
      return (
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Game-specific displays */}
            {state.gameType === GAME_MODES.X01 && <FinishSuggestion />}
            {state.gameType === GAME_MODES.AROUND_THE_CLOCK && <TargetDisplay />}
            {state.gameType === GAME_MODES.MULTIPLICATION && <MultiplicationTargetDisplay />}

            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {getGameTitle(state.gameMode)}
              </h1>
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
              {state.gameType === GAME_MODES.AROUND_THE_CLOCK ? (
                <AroundTheClockScoreboard />
              ) : state.gameType === GAME_MODES.MULTIPLICATION ? (
                <MultiplicationScoreboard />
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
      return (
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-center">Unknown Game State</h1>
            </div>
          </div>
        </div>
      );
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