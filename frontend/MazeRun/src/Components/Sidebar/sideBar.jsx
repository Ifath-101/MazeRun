import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Link to={'/playgame'} style={{ textDecoration: "none" }}>
                <div className='sidebar-item'>
                    <p>Play Game</p>
                </div>
            </Link>

            <Link to={'/highscores'} style={{ textDecoration: "none" }}>
            <div className='sidebar-item'>
                <p>High Scores</p>
            </div>
            </Link>
        </div>
    )
}

export default Sidebar