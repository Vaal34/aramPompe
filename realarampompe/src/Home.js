import './Home.css';
import { useLocation } from 'react-router-dom';

function Home(){
    
    const location = useLocation();

    return( 
        <div>
            <h1>{location.state.Pseudo}</h1>
        </div>
    )
}

export default Home;