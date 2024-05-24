import './App.css';
import $ from 'jquery'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function App() {


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

  return (
    <>
      <div className="App">
        <h1>ARAM POMPE</h1>
        <form onSubmit={handleSubmit}>
          <input id="inputText" className='inputText' type='text' placeholder='gameName#tag'></input>
          <button className='sendInput' type='submit'>Submit</button>
        </form>
      </div>
    </>
    )
}

export default App;
