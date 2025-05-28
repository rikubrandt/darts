'use client'

/**
 * Create SVG path for a dartboard segment
 * @param {Number} startAngle - Start angle in degrees
 * @param {Number} endAngle - End angle in degrees
 * @param {Number} innerRadius - Inner radius
 * @param {Number} outerRadius - Outer radius
 * @param {Number} centerX - X coordinate of center
 * @param {Number} centerY - Y coordinate of center
 * @returns {String} - SVG path string
 */
export function createSegmentPath(
  startAngle, 
  endAngle, 
  innerRadius, 
  outerRadius, 
  centerX = 200, 
  centerY = 200
) {
  const startAngleRad = (startAngle - 90) * Math.PI / 180;
  const endAngleRad = (endAngle - 90) * Math.PI / 180;
  
  const x1 = centerX + innerRadius * Math.cos(startAngleRad);
  const y1 = centerY + innerRadius * Math.sin(startAngleRad);
  const x2 = centerX + outerRadius * Math.cos(startAngleRad);
  const y2 = centerY + outerRadius * Math.sin(startAngleRad);
  
  const x3 = centerX + outerRadius * Math.cos(endAngleRad);
  const y3 = centerY + outerRadius * Math.sin(endAngleRad);
  const x4 = centerX + innerRadius * Math.cos(endAngleRad);
  const y4 = centerY + innerRadius * Math.sin(endAngleRad);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
    `L ${x4} ${y4}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
    'Z'
  ].join(' ');
}

/**
 * Get position for text in a dartboard segment
 * @param {Number} angle - Angle in degrees
 * @param {Number} radius - Radius
 * @param {Number} centerX - X coordinate of center
 * @param {Number} centerY - Y coordinate of center
 * @returns {Object} - x and y coordinates
 */
export function getTextPosition(angle, radius, centerX = 200, centerY = 200) {
  const angleRad = (angle - 90) * Math.PI / 180;
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad)
  };
}