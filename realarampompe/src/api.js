export async function fetchRiotAccount(gameName, tagGame, apiKey){
    try {
        const response = await fetch(`/riot/account/v1/accounts/by-riot-id/${gameName}/${tagGame}?api_key=${apiKey}`, { mode: 'cors' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching riot data:', error);
        return null;
    }
};

export async function fetchLastMatch(uuid, apiKey){
    try {
        const responseMatchsId = await fetch(`/lol/match/v5/matches/by-puuid/${uuid}/ids?start=0&count=20&api_key=${apiKey}`, { mode: 'cors' });
        const data = await responseMatchsId.json();
        const responseMatch = await fetch(`/lol/match/v5/matches/${data[0]}?api_key=${apiKey}`, { mode: 'cors' });
        const dataMatch = await responseMatch.json();
        return dataMatch
    } catch (error) {
        console.error('Error fetching lol data:', error);
        return null;
    }
};
