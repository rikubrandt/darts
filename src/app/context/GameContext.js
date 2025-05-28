'use client'
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Initial state
const initialState = {
  gameState: 'setup', // setup, gameSelect, playing, gameOver
  players: [],
  currentPlayer: 0,
  gameMode: null,
  gameType: null, // Identifies which game implementation to use (x01, cricket, etc.)
  scores: {},
  currentDarts: [],
  finishSuggestion: null,
  editingIndex: null,
  showBustModal: false,
  bustMessage: '',
};

// Action types
const ACTIONS = {
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_PLAYERS: 'SET_PLAYERS',
  ADD_PLAYER: 'ADD_PLAYER',
  REMOVE_PLAYER: 'REMOVE_PLAYER',
  SET_CURRENT_PLAYER: 'SET_CURRENT_PLAYER',
  SET_GAME_MODE: 'SET_GAME_MODE',
  SET_SCORES: 'SET_SCORES',
  UPDATE_SCORE: 'UPDATE_SCORE',
  SET_CURRENT_DARTS: 'SET_CURRENT_DARTS',
  ADD_DART: 'ADD_DART',
  REMOVE_DART: 'REMOVE_DART',
  REPLACE_DART: 'REPLACE_DART',
  SET_FINISH_SUGGESTION: 'SET_FINISH_SUGGESTION',
  SET_EDITING_INDEX: 'SET_EDITING_INDEX',
  SHOW_BUST_MODAL: 'SHOW_BUST_MODAL',
  HIDE_BUST_MODAL: 'HIDE_BUST_MODAL',
  RESET_GAME: 'RESET_GAME',
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_GAME_STATE:
      return { ...state, gameState: action.payload };
    case ACTIONS.SET_PLAYERS:
      return { ...state, players: action.payload };
    case ACTIONS.ADD_PLAYER:
      return { ...state, players: [...state.players, action.payload] };
    case ACTIONS.REMOVE_PLAYER:
      return { 
        ...state, 
        players: state.players.filter((_, i) => i !== action.payload) 
      };
    case ACTIONS.SET_CURRENT_PLAYER:
      return { ...state, currentPlayer: action.payload };
    case ACTIONS.SET_GAME_MODE:
      return { 
        ...state, 
        gameMode: action.payload.mode,
        gameType: action.payload.type 
      };
    case ACTIONS.SET_SCORES:
      return { ...state, scores: action.payload };
    case ACTIONS.UPDATE_SCORE:
      return { 
        ...state, 
        scores: { 
          ...state.scores, 
          [action.payload.player]: action.payload.score 
        } 
      };
    case ACTIONS.SET_CURRENT_DARTS:
      return { ...state, currentDarts: action.payload };
    case ACTIONS.ADD_DART:
      return { 
        ...state, 
        currentDarts: [...state.currentDarts, action.payload] 
      };
    case ACTIONS.REMOVE_DART:
      return { 
        ...state, 
        currentDarts: state.currentDarts.filter((_, i) => i !== action.payload) 
      };
    case ACTIONS.REPLACE_DART:
      return { 
        ...state, 
        currentDarts: state.currentDarts.map((dart, i) => 
          i === action.payload.index ? action.payload.dart : dart
        ) 
      };
    case ACTIONS.SET_FINISH_SUGGESTION:
      return { ...state, finishSuggestion: action.payload };
    case ACTIONS.SET_EDITING_INDEX:
      return { ...state, editingIndex: action.payload };
    case ACTIONS.SHOW_BUST_MODAL:
      return { ...state, showBustModal: true, bustMessage: action.payload };
    case ACTIONS.HIDE_BUST_MODAL:
      return { ...state, showBustModal: false };
    case ACTIONS.RESET_GAME:
      return initialState;
    default:
      return state;
  }
}

// Create context
const GameContext = createContext();

// Context provider
export function GameProvider({ children }) {
  const [savedState, saveState] = useLocalStorage('dart-game-state', null);
  const [state, dispatch] = useReducer(gameReducer, savedState || initialState);
  
  // Flag to prevent saving during initial render
  const isInitialMount = useRef(true);

  // Save state to localStorage whenever it changes, but not on initial render
  useEffect(() => {
    // Skip the first render and don't save if we're just starting up
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only save if we have meaningful data
    if (state.gameState !== 'setup' || state.players.length > 0) {
      // Create a stable reference for the saving to prevent infinite loops
      const stateToSave = {
        ...state,
        timestamp: Date.now()
      };
      
      // Use a timeout to prevent immediate re-renders
      const saveTimeout = setTimeout(() => {
        saveState(stateToSave);
      }, 0);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [
    state.gameState, 
    state.players, 
    state.currentPlayer, 
    state.gameMode, 
    state.gameType, 
    state.scores, 
    state.currentDarts.length, // Only track length changes, not the array itself
    state.finishSuggestion, 
    state.editingIndex
  ]);

  // Auto-hide bust modal
  useEffect(() => {
    if (!state.showBustModal) return;
    const timer = setTimeout(() => {
      dispatch({ type: ACTIONS.HIDE_BUST_MODAL });
    }, 1500);
    return () => clearTimeout(timer);
  }, [state.showBustModal]);

  return (
    <GameContext.Provider value={{ state, dispatch, ACTIONS }}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}