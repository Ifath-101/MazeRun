import React, { useState, useEffect } from 'react';
import './PlayGame.css';
import axios from 'axios';

const PlayGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [name, setName] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isFrozen, setIsFrozen] = useState(false);
  const [trophyCollected, setTrophyCollected] = useState(false);
  const [nameEntered, setNameEntered] = useState(false);

  useEffect(() => {
    let timer;
    if (gameStarted && nameEntered && !isFrozen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, nameEntered, isFrozen, timeLeft]);

  useEffect(() => {
    let interval;
    if (gameStarted && nameEntered && !isFrozen) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get('/api/ir');
          if (res.data.freeze) {
            setIsFrozen(true);
            await axios.post('/api/save', { name, time: timeLeft });
            alert(`IR detected! Timer frozen at ${timeLeft}s and saved to DB.`);
          }
          if (res.data.trophy) {
            setTrophyCollected(true);
          }
        } catch (err) {
          console.error('Error checking IR signal:', err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, nameEntered, isFrozen, timeLeft, name]);

  const handleStart = () => setGameStarted(true);
  const handleNameSubmit = () => {
    if (name.trim() !== '') setNameEntered(true);
  };

  return (
    <div className="playgame-container">
      {!gameStarted ? (
        <button className="start-button" onClick={handleStart}>
          Start Game
        </button>
      ) : !nameEntered ? (
        <div className="name-input-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleNameSubmit}>Submit</button>
        </div>
      ) : (
        <div className="game-section">
          <h2>Player: {name}</h2>
          <div className={`timer-display ${timeLeft <= 30 ? 'low-time' : ''}`}>
            {timeLeft} s
          </div>
          {isFrozen && <p className="frozen-text">Timer frozen due to IR detection.</p>}
          {trophyCollected && <p className="trophy-text">Trophy collected 🏆</p>}
        </div>
      )}
    </div>
  );
};

export default PlayGame;
