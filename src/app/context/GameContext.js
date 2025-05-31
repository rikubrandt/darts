'use client'
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

// Initial state
const initialState = {
  gameState: 'setup', // setup, gameSelect, playing, gameOver
  players: [],
  currentPlayer: 0,
  gameMode: null,
  gameType: null, 
  scores: {},
  currentDarts: [],
  finishSuggestion: null,
  editingIndex: null,
  showBustModal: false,
  bustMessage: '',
};

// Storage key
const STORAGE_KEY = 'dart-game-state';

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

function loadSavedState() {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
}

// Reducer function
function gameReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case ACTIONS.SET_GAME_STATE:
      newState = { ...state, gameState: action.payload };
      break;
    case ACTIONS.SET_PLAYERS:
      newState = { ...state, players: action.payload };
      break;
    case ACTIONS.ADD_PLAYER:
      newState = { 
        ...state, 
        players: [...state.players, action.payload] 
      };
      break;
    case ACTIONS.REMOVE_PLAYER:
      newState = { 
        ...state, 
        players: state.players.filter((_, i) => i !== action.payload) 
      };
      break;
    case ACTIONS.SET_CURRENT_PLAYER:
      newState = { ...state, currentPlayer: action.payload };
      break;
    case ACTIONS.SET_GAME_MODE:
      newState = { 
        ...state, 
        gameMode: action.payload.mode,
        gameType: action.payload.type 
      };
      break;
    case ACTIONS.SET_SCORES:
      newState = { ...state, scores: action.payload };
      break;
    case ACTIONS.UPDATE_SCORE:
      newState = { 
        ...state, 
        scores: { 
          ...state.scores, 
          [action.payload.player]: action.payload.score 
        } 
      };
      break;
    case ACTIONS.SET_CURRENT_DARTS:
      newState = { ...state, currentDarts: action.payload };
      break;
    case ACTIONS.ADD_DART:
      newState = { 
        ...state, 
        currentDarts: [...state.currentDarts, action.payload] 
      };
      break;
    case ACTIONS.REMOVE_DART:
      newState = { 
        ...state, 
        currentDarts: state.currentDarts.filter((_, i) => i !== action.payload) 
      };
      break;
    case ACTIONS.REPLACE_DART:
      newState = { 
        ...state, 
        currentDarts: state.currentDarts.map((dart, i) => 
          i === action.payload.index ? action.payload.dart : dart
        ) 
      };
      break;
    case ACTIONS.SET_FINISH_SUGGESTION:
      newState = { ...state, finishSuggestion: action.payload };
      break;
    case ACTIONS.SET_EDITING_INDEX:
      newState = { ...state, editingIndex: action.payload };
      break;
    case ACTIONS.SHOW_BUST_MODAL:
      newState = { ...state, showBustModal: true, bustMessage: action.payload };
      break;
    case ACTIONS.HIDE_BUST_MODAL:
      newState = { ...state, showBustModal: false };
      break;
    case ACTIONS.RESET_GAME:
      newState = initialState;
      // Clear localStorage when resetting
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      break;
    default:
      return state;
  }
  
  // Save state if we're in playing mode
  if (newState.gameState === 'playing' && typeof window !== 'undefined') {
    // We use a timeout to ensure this doesn't cause rendering issues
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        // Silent fail
      }
    }, 0);
  }
  
  return newState;
}

// Create context
const GameContext = createContext();

// Context provider
export function GameProvider({ children }) {
  const savedState = loadSavedState();
  const initialStateWithSaved = savedState || initialState;
  
  // Initialize reducer with initial state
  const [state, dispatch] = useReducer(gameReducer, initialStateWithSaved);

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