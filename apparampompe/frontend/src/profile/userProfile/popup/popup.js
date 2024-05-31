import React from "react";
import './popup.css';

function Popup({ isOpen, togglePopup }) {

    return (
        <div className="popup">
            <div className="popup_inner">
                <button onClick={togglePopup}>X</button>
                <form>
                    <p>Veuillez entrer votre pseudo Riot</p>
                    <input type="text" placeholder="gameName#tag" spellCheck="false"/>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}

export default Popup;
