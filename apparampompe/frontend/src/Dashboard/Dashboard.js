import React from "react";
import "./Dashboard.css";

function Dashboard() {

    return (
        <div className="dashboard">
            <div>
                <button className='goToMatch'> Match </button>
                <button className='goToProfile'> Profile </button>
            </div>
            <video autoPlay loop muted>
                    <source src={require("../assets/Background1.webm")} type="video/webm" />
            </video>
        </div>
    )
}

export default Dashboard;