function pompesCalculator(matchData, players){

    const infoPlayers = matchData.info?.participants || [];
    const gameNames = players.map(player => player.gameName.split('#')[0])
    const teamCurrentPlayer = infoPlayers.filter(player => gameNames.includes(player.riotIdGameName));

    console.log(teamCurrentPlayer, "teamCurrentPlayer")
    if (teamCurrentPlayer.length === 0) {
        return 0;
    }
    const statGame = teamCurrentPlayer.map(player => ({kill: player.kills, player: `${player.riotIdGameName}#${player.riotIdTagline}`}));
    const playerLost = statGame.reduce((prev, current) => (prev.kill < current.kill) ? prev : current);
    const playerWin = statGame.filter(player => player !== playerLost);
    const pompes = playerWin.map(player => player.kill);
    let totalPompes = 0;
    for (let i = 0; i < pompes.length; i++) {
        console.log(pompes[i], "pompes")
        totalPompes += pompes[i];
    }
    return [totalPompes, playerLost.player];
}

export default pompesCalculator;