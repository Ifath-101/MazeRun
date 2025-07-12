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
  const [gameEnded, setGameEnded] = useState(false); // ✅ NEW

  useEffect(() => {
    let timer;
    if (gameStarted && nameEntered && !isFrozen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            setGameEnded(true); // ✅ NEW
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, nameEntered, isFrozen, timeLeft]);

  useEffect(() => {
    let interval;
    if (gameStarted && nameEntered && !isFrozen && !gameEnded) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get('/api/ir');
          if (res.data.freeze) {
            setIsFrozen(true);
            try {
              await axios.post('/api/save', { name, time: timeLeft });
              alert(`IR detected! Timer frozen at ${timeLeft}s and saved to DB.`);
              setGameEnded(true); // ✅ NEW
            } catch (err) {
              alert('Failed to save score to database. Try again.');
              console.error(err);
            }
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
  }, [gameStarted, nameEntered, isFrozen, timeLeft, name, gameEnded]);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleNameSubmit = () => {
    if (name.trim() !== '') setNameEntered(true);
  };

  const handleRestart = () => {
    // ✅ NEW RESET STATE
    setGameStarted(false);
    setName('');
    setTimeLeft(300);
    setIsFrozen(false);
    setTrophyCollected(false);
    setNameEntered(false);
    setGameEnded(false);
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
          {gameEnded && (
            <button className="restart-button" onClick={handleRestart}>
              Restart Game
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayGame;
