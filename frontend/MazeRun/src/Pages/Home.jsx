import React from 'react';
import './Home.css';
import Sidebar from '../Components/Sidebar/sideBar';
import { Routes, Route } from 'react-router-dom';
import PlayGame from '../Components/Playgame/playGame';
import HighScores from '../Components/Highscores/highScores';

const Home = () => {
  return (
    <div className='home'>
      <Sidebar />
      <div className='routes-container'>
        <Routes>
          <Route path='/playgame' element={<PlayGame />} />
          <Route path='/highscores' element={<HighScores />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
