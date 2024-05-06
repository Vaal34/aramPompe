import './App.css';
import $ from 'jquery'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  // eslint-disable-next-line
  const [pseudo, setPseudo] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const Pseudo = $('.inputText').val()
    setPseudo(Pseudo);
    navigate('/dashboard', { state: { Pseudo: Pseudo } });
  };

  console.log("test")

  return (
    <div className="App">
      <h1>ARAM POMPE</h1>
      <form onSubmit={handleSubmit}>
        <input className='inputText' type='text' placeholder='Pseudo + #Tag'></input>
        <input className='sendInput' type='submit'></input>
      </form>
    </div>
  );
}

export default App;
