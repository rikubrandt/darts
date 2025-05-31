'use client'
import React from 'react';
import { 
  DARTBOARD_NUMBERS, 
  DARTBOARD_COLORS, 
  REGIONS 
} from '../../lib/constants';
import { 
  createSegmentPath, 
  getTextPosition 
} from '../../lib/utils';
import { useGameContext } from '../../context/GameContext';

const Dartboard = () => {
  const { state, dispatch, ACTIONS } = useGameContext();
  const { gameState, editingIndex, currentDarts } = state;

  const handleDartClick = (region, value) => {
    if (gameState !== 'playing') return;
    
    const dart = { region, value };
    
    // If we are replacing an existing dart
    if (editingIndex !== null) {
      dispatch({ 
        type: ACTIONS.REPLACE_DART, 
        payload: { index: editingIndex, dart } 
      });
      dispatch({ type: ACTIONS.SET_EDITING_INDEX, payload: null });
      return;
    }
    
    // Otherwise add a new dart (max 3)
    if (currentDarts.length < 3) {
      dispatch({ type: ACTIONS.ADD_DART, payload: dart });
    }
  };

  // Adjusted segment dimensions for better mobile usability
  const dimensions = {
    outerRadius: 190,
    doubleInner: 165,
    doubleOuter: 190, 
    outerSingleInner: 95,
    outerSingleOuter: 165,
    tripleInner: 80,
    tripleOuter: 95, 
    innerSingleInner: 25,
    innerSingleOuter: 80,
    singleBullRadius: 25,
    doubleBullRadius: 12.5
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-full h-auto">
        {/* Outer border */}
        <circle 
          cx="200" 
          cy="200" 
          r={dimensions.outerRadius} 
          fill={DARTBOARD_COLORS.dark} 
          stroke="#000" 
          strokeWidth="2" 
        />
        
        {DARTBOARD_NUMBERS.map((number, index) => {
          const startAngle = index * 18 - 9;
          const endAngle = (index + 1) * 18 - 9;
          const midAngle = startAngle + 9;
          const isEven = index % 2 === 0;
          
          return (
            <g key={`segment-${number}`}>
              {/* Outer single (largest region) */}
              <path
                d={createSegmentPath(startAngle, endAngle, dimensions.outerSingleInner, dimensions.outerSingleOuter)}
                fill={isEven ? DARTBOARD_COLORS.light : DARTBOARD_COLORS.dark}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`${REGIONS.SINGLE} ${number}`, number)}
              />
              
              {/* Double ring (outer) - made larger */}
              <path
                d={createSegmentPath(startAngle, endAngle, dimensions.doubleInner, dimensions.doubleOuter)}
                fill={DARTBOARD_COLORS.double}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`${REGIONS.DOUBLE} ${number}`, number * 2)}
              />
              
              {/* Inner single */}
              <path
                d={createSegmentPath(startAngle, endAngle, dimensions.innerSingleInner, dimensions.innerSingleOuter)}
                fill={isEven ? DARTBOARD_COLORS.light : DARTBOARD_COLORS.dark}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`${REGIONS.SINGLE} ${number}`, number)}
              />
              
              {/* Triple ring - made larger */}
              <path
                d={createSegmentPath(startAngle, endAngle, dimensions.tripleInner, dimensions.tripleOuter)}
                fill={DARTBOARD_COLORS.triple}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`${REGIONS.TRIPLE} ${number}`, number * 3)}
              />
              
              {/* Number text */}
              <text
                x={getTextPosition(midAngle, dimensions.doubleInner + 13).x}
                y={getTextPosition(midAngle, dimensions.doubleInner + 13).y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="16"
                fontWeight="bold"
                fill="white"
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                {number}
              </text>
            </g>
          );
        })}
        
        {/* Single Bull (outer bullseye) */}
        <circle
          cx="200"
          cy="200"
          r={dimensions.singleBullRadius}
          fill={DARTBOARD_COLORS.singleBull}
          stroke="#000"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onClick={() => handleDartClick(REGIONS.SINGLE_BULL, 25)}
        />
        
        {/* Double Bull (inner bullseye) */}
        <circle
          cx="200"
          cy="200"
          r={dimensions.doubleBullRadius}
          fill={DARTBOARD_COLORS.doubleBull}
          stroke="#000"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onClick={() => handleDartClick(REGIONS.DOUBLE_BULL, 50)}
        />
      </svg>
    </div>
  );
};

export default Dartboard;