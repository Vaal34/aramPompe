import React, { useState } from 'react';
import Select from 'react-dropdown-select';
import './userProfile.css';
import Popup from './popup/popup';

const UserProfile = ({ user }) => {
    // eslint-disable-next-line
    const [values, setValues] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        {
          id: 1,
          name: 'Leanne Graham'
        },
        {
          id: 2,
          name: 'Ervin Howell'
        }
      ];

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            {user ? (
                <div className='dataProfil'>
                    <p>email :</p>
                    <h2>{user.email}</h2>
                    <p>Liste de vos comptes Riot :</p>
                    <Select
                        options={options}
                        labelField="name"
                        valueField="id"
                        onChange={(values) => setValues(values)}
                    />
                </div>
            ) : (
                <p>No user information available</p>
            )}
            {isOpen && <Popup isOpen={isOpen} togglePopup={togglePopup} />}
            <button className="sendAddAccount" type="submit" onClick={togglePopup}>
                Ajouter un compte Riot
            </button>
        </>
    );
};

export default UserProfile;
