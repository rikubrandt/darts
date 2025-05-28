'use client'
import React, { useState } from 'react';

const DartGame = () => {
  const [gameState, setGameState] = useState('setup'); // setup, gameSelect, playing, gameOver
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [scores, setScores] = useState({});
  const [currentDarts, setCurrentDarts] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Standard dartboard number sequence (20 at top center)
  const numbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  
  const colors = {
    dark: '#2c3e50',
    light: '#ecf0f1',
    singleBull: '#27ae60',
    doubleBull: '#e74c3c',
    double: '#e74c3c',
    triple: '#27ae60'
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const startGame = (mode) => {
    const startingScore = mode === '501' ? 501 : 201;
    const initialScores = {};
    players.forEach(player => {
      initialScores[player] = startingScore;
    });
    setScores(initialScores);
    setGameMode(mode);
    setGameState('playing');
    setCurrentPlayer(0);
    setCurrentDarts([]);
  };

  const handleDartClick = (region, value) => {
    if (gameState !== 'playing' || currentDarts.length >= 3) return;
    
    const dart = { region, value };
    setCurrentDarts([...currentDarts, dart]);
    console.log(`Dart ${currentDarts.length + 1}: ${region} - Value: ${value}`);
  };

  const submitTurn = () => {
    if (currentDarts.length === 0) return;
    
    const playerName = players[currentPlayer];
    const currentScore = scores[playerName];
    const turnTotal = currentDarts.reduce((sum, dart) => sum + dart.value, 0);
    
    // Check for valid finish (must end on double)
    const lastDart = currentDarts[currentDarts.length - 1];
    const newScore = currentScore - turnTotal;
    
    if (newScore < 0 || (newScore === 0 && !lastDart.region.includes('Double'))) {
      // Bust - score stays the same
      console.log(`${playerName} busted! Score remains ${currentScore}`);
    } else if (newScore === 0) {
      // Winner!
      setScores({...scores, [playerName]: 0});
      setGameState('gameOver');
      console.log(`${playerName} wins!`);
      return;
    } else {
      // Valid turn
      setScores({...scores, [playerName]: newScore});
    }
    
    // Next player
    setCurrentPlayer((currentPlayer + 1) % players.length);
    setCurrentDarts([]);
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentPlayer(0);
    setGameMode(null);
    setScores({});
    setCurrentDarts([]);
  };

  // Create path for a segment
  const createSegmentPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    const startAngleRad = (startAngle - 90) * Math.PI / 180;
    const endAngleRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = 200 + innerRadius * Math.cos(startAngleRad);
    const y1 = 200 + innerRadius * Math.sin(startAngleRad);
    const x2 = 200 + outerRadius * Math.cos(startAngleRad);
    const y2 = 200 + outerRadius * Math.sin(startAngleRad);
    
    const x3 = 200 + outerRadius * Math.cos(endAngleRad);
    const y3 = 200 + outerRadius * Math.sin(endAngleRad);
    const x4 = 200 + innerRadius * Math.cos(endAngleRad);
    const y4 = 200 + innerRadius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
      'Z'
    ].join(' ');
  };

  const getTextPosition = (angle, radius) => {
    const angleRad = (angle - 90) * Math.PI / 180;
    return {
      x: 200 + radius * Math.cos(angleRad),
      y: 200 + radius * Math.sin(angleRad)
    };
  };

  const renderDartboard = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-full h-auto">
        {/* Outer ring */}
        <circle cx="200" cy="200" r="190" fill={colors.dark} stroke="#000" strokeWidth="2" />
        
        {numbers.map((number, index) => {
          const startAngle = index * 18;
          const endAngle = (index + 1) * 18;
          const midAngle = startAngle + 9;
          const isEven = index % 2 === 0;
          
          return (
            <g key={`segment-${number}`}>
              {/* Outer single (largest region) */}
              <path
                d={createSegmentPath(startAngle, endAngle, 110, 170)}
                fill={isEven ? colors.light : colors.dark}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`Single ${number}`, number)}
              />
              
              {/* Double ring (smaller) */}
              <path
                d={createSegmentPath(startAngle, endAngle, 170, 185)}
                fill={colors.double}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`Double ${number}`, number * 2)}
              />
              
              {/* Inner single (largest region) */}
              <path
                d={createSegmentPath(startAngle, endAngle, 40, 95)}
                fill={isEven ? colors.light : colors.dark}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`Single ${number}`, number)}
              />
              
              {/* Triple ring (smaller) */}
              <path
                d={createSegmentPath(startAngle, endAngle, 95, 110)}
                fill={colors.triple}
                stroke="#000"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDartClick(`Triple ${number}`, number * 3)}
              />
              
              {/* Number text */}
              <text
                x={getTextPosition(midAngle, 177).x}
                y={getTextPosition(midAngle, 177).y}
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
        
        {/* Single Bull */}
        <circle
          cx="200"
          cy="200"
          r="20"
          fill={colors.singleBull}
          stroke="#000"
          strokeWidth="2"
          style={{ cursor: 'pointer' }}
          onClick={() => handleDartClick('Single Bull', 25)}
        />
        
        {/* Double Bull */}
        <circle
          cx="200"
          cy="200"
          r="10"
          fill={colors.doubleBull}
          stroke="#000"
          strokeWidth="2"
          style={{ cursor: 'pointer' }}
          onClick={() => handleDartClick('Double Bull', 50)}
        />
      </svg>
    </div>
  );

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Dart Game Setup</h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Players</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Enter player name"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addPlayer}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </div>

          {players.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Players:</h3>
              <ul className="space-y-1">
                {players.map((player, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{player}</span>
                    <button
                      onClick={() => setPlayers(players.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {players.length > 0 && (
            <button
              onClick={() => setGameState('gameSelect')}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Continue to Game Selection
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'gameSelect') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Select Game Mode</h1>
          
          <div className="space-y-4">
            <button
              onClick={() => startGame('501')}
              className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="text-xl font-bold">501</div>
              <div className="text-sm">Start with 501 points, first to 0 wins</div>
              <div className="text-sm">Must finish on double</div>
            </button>
            
            <button
              onClick={() => startGame('201')}
              className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className="text-xl font-bold">201</div>
              <div className="text-sm">Start with 201 points, first to 0 wins</div>
              <div className="text-sm">Must finish on double</div>
            </button>
          </div>
          
          <button
            onClick={() => setGameState('setup')}
            className="w-full mt-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    const winner = players.find(player => scores[player] === 0);
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Game Over!</h1>
          <h2 className="text-2xl font-semibold mb-6">🎉 {winner} Wins! 🎉</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Final Scores:</h3>
            {players.map(player => (
              <div key={player} className="flex justify-between p-2 bg-gray-50 rounded mb-1">
                <span>{player}</span>
                <span className={scores[player] === 0 ? 'text-green-600 font-bold' : ''}>
                  {scores[player]}
                </span>
              </div>
            ))}
          </div>
          
          <button
            onClick={resetGame}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{gameMode} Game</h1>
          <div className="text-xl mt-2">
            <span className="font-semibold text-blue-600">{players[currentPlayer]}'s Turn</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dartboard */}
          <div className="flex flex-col items-center">
            {renderDartboard()}
            
            <div className="mt-4 w-full max-w-sm">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Current Turn:</h3>
                <div className="space-y-1">
                  {currentDarts.map((dart, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Dart {index + 1}:</span>
                      <span>{dart.region} ({dart.value})</span>
                    </div>
                  ))}
                  {Array.from({length: 3 - currentDarts.length}).map((_, index) => (
                    <div key={`empty-${index}`} className="flex justify-between text-sm text-gray-400">
                      <span>Dart {currentDarts.length + index + 1}:</span>
                      <span>-</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Turn Total:</span>
                    <span>{currentDarts.reduce((sum, dart) => sum + dart.value, 0)}</span>
                  </div>
                </div>
                
                <button
                  onClick={submitTurn}
                  disabled={currentDarts.length === 0}
                  className="w-full mt-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next Player
                </button>
              </div>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Scoreboard</h2>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div
                  key={player}
                  className={`p-4 rounded-lg border-2 ${
                    index === currentPlayer 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{player}</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {scores[player]}
                    </span>
                  </div>
                  {index === currentPlayer && (
                    <div className="text-sm text-blue-600 mt-1">← Current Player</div>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={resetGame}
              className="w-full mt-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Quit Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DartGame;