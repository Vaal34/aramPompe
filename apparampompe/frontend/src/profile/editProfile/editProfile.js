import React from 'react';

const EditProfile = ({ user }) => {
    return (
        <>
            {user ? (
                <form className='formProfile'>
                    <button type="submit">Change Password</button>
                    <button type="submit">Change Email Address</button>
                </form>
            ) : (
                <p>No user information available</p>
            )}
        </>
        )
};

export default EditProfile;