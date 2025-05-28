'use client'
import React from 'react';
import { createSegmentPath } from '../../lib/utils';

const DartboardSegment = ({ 
  number, 
  startAngle, 
  endAngle, 
  isEven, 
  colors, 
  onDartClick 
}) => {
  return (
    <>
      {/* Outer single (largest region) */}
      <path
        d={createSegmentPath(startAngle, endAngle, 110, 170)}
        fill={isEven ? colors.light : colors.dark}
        stroke="#000"
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={() => onDartClick(`Single ${number}`, number)}
      />
      
      {/* Double ring (smaller) */}
      <path
        d={createSegmentPath(startAngle, endAngle, 170, 185)}
        fill={colors.double}
        stroke="#000"
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={() => onDartClick(`Double ${number}`, number * 2)}
      />
      
      {/* Inner single (middle region) */}
      <path
        d={createSegmentPath(startAngle, endAngle, 40, 95)}
        fill={isEven ? colors.light : colors.dark}
        stroke="#000"
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={() => onDartClick(`Single ${number}`, number)}
      />
      
      {/* Triple ring (smaller) */}
      <path
        d={createSegmentPath(startAngle, endAngle, 95, 110)}
        fill={colors.triple}
        stroke="#000"
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={() => onDartClick(`Triple ${number}`, number * 3)}
      />
    </>
  );
};

export default DartboardSegment;