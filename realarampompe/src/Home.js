import './Home.css';
import { useLocation } from 'react-router-dom';
import { RiotApi, Constants } from 'twisted'

function Home(){
    
    const api = new RiotApi()
    const location = useLocation();
    
    async function getAccount () {
        return (await api.Account.getByRiotId("Kaao", "EUV", Constants.RegionGroups.EUROPE)).response
    }

    const account = getAccount()
    console.log(account);

    return( 
        <div>
            <h1>{location.state.Pseudo}</h1>
        </div>
    )
}

export default Home;