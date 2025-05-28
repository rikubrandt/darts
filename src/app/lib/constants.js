'use client'

// Standard dartboard number sequence (20 at top center)
export const DARTBOARD_NUMBERS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5
];

// Dartboard color scheme
export const DARTBOARD_COLORS = {
  dark: '#2c3e50',
  light: '#ecf0f1',
  singleBull: '#27ae60',
  doubleBull: '#e74c3c',
  double: '#e74c3c',
  triple: '#27ae60'
};

// Game states
export const GAME_STATES = {
  SETUP: 'setup',
  GAME_SELECT: 'gameSelect',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver'
};

// Dartboard regions
export const REGIONS = {
  SINGLE: 'Single',
  DOUBLE: 'Double',
  TRIPLE: 'Triple',
  SINGLE_BULL: 'Single Bull',
  DOUBLE_BULL: 'Double Bull'
};