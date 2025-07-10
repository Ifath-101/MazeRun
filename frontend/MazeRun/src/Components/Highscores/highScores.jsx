import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './highScores.css';

const HighScores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get('http://localhost:5000/highscores');
        setScores(res.data.data);
      } catch (err) {
        console.error("Error fetching high scores:", err);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="scores-container">
      <h2>🏆 Leaderboard</h2>
      <p className="subtitle">Top players sorted by time (ascending)</p>
      <table className="scores-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player Name</th>
            <th>Time Left (s)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score._id}>
              <td>{index + 1}</td>
              <td>{score.name}</td>
              <td>{score.time}</td>
              <td>{new Date(score.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HighScores;
