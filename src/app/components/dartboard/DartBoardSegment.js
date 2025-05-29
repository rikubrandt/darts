'use client'
import React from 'react';
import { createSegmentPath } from '../../lib/utils';

const DartboardSegment = ({ 
  number, 
  startAngle, 
  endAngle, 
  isEven, 
  colors, 
  onDartClick,
  dimensions = {
    outerRadius: 190,
    doubleInner: 165,
    doubleOuter: 190,
    outerSingleInner: 95,
    outerSingleOuter: 165,
    tripleInner: 80,
    tripleOuter: 95,
    innerSingleInner: 25,
    innerSingleOuter: 80
  }
}) => {
  return (
    <>
      <path
        d={createSegmentPath(startAngle, endAngle, dimensions.outerSingleInner, dimensions.outerSingleOuter)}
        fill={isEven ? colors.light : colors.dark}
        stroke="#000"
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={() => onDartClick(`Single ${number}`, number)}
      />
      
      <path
        d={createSegmentPath(startAngle, endAngle, dimensions.doubleInner, dimensions.doubleOuter)}
        fill={colors.double}
        stroke="#000"
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={() => onDartClick(`Double ${number}`, number * 2)}
      />
      
      <path
        d={createSegmentPath(startAngle, endAngle, dimensions.innerSingleInner, dimensions.innerSingleOuter)}
        fill={isEven ? colors.light : colors.dark}
        stroke="#000"
        strokeWidth="1"
        style={{ cursor: 'pointer' }}
        onClick={() => onDartClick(`Single ${number}`, number)}
      />
      
      <path
        d={createSegmentPath(startAngle, endAngle, dimensions.tripleInner, dimensions.tripleOuter)}
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