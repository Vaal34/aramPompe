import './App.css';
import $ from 'jquery'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LoginButton from "../Auth/Login/Login";
import LogoutButton from "../Auth/Logout/Logout";
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  
  const { isAuthenticated } = useAuth0();
  
  const navigate = useNavigate();
  
  /* eslint-disable-next-line */
  const [pseudo, setPseudo] = useState('');
  /* eslint-disable-next-line */
  const [tag, setTag] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const inputValue = $('.inputText').val();
    const [gameName, tag] = inputValue.split('#');
  
    setTag(tag)
    setPseudo(gameName);
    navigate('/dashboard', { state: { gameName: gameName, tag: tag } });
  
  }

  if (isAuthenticated) {
  return (
    <>
      <div className="App">
        <h1>ARAM POMPE</h1>
        <form onSubmit={handleSubmit}>
          <input id="inputText" className='inputText' type='text' placeholder='gameName#tag'></input>
          <button className='sendInput' type='submit'>Submit</button>
        </form>
        <LogoutButton />
      </div>
    </>
    )
  } else {
    return <LoginButton />
  }
}

export default App;
