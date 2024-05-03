import './Home.css';
import { useLocation } from 'react-router-dom';

function Home(){

    const location = useLocation();

    return(
        <h1>{location.state.Pseudo}</h1>
    )
}

export default Home;