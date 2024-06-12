import React from "react";
import "./Dashboard.css";
import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const navigate = useNavigate()

    const handleNavigateTo = (path) => {
        navigate(path)
    }

    return (
        <div className="dashboard">
            <div>
                <button className='goToProfile' onClick={() => handleNavigateTo('/profile')}>PROFILE</button>
                <button className='goToMatch' onClick={() => handleNavigateTo('/match')}>MATCH</button>
            </div>
            <video autoPlay loop muted>
                    <source src={require("../assets/voli.mp4")} type="video/mp4" />
            </video>
        </div>
    )
}

export default Dashboard;