const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

const RIOT_API_KEY = 'RGAPI-7bae316f-5d40-45c2-a87c-7067a9d3b4f0';

app.use(bodyParser.json());

const db = mysql.createConnection({
    /*host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'auth'*/
    host: 'localhost',
    user: 'val34',
    password: 'root',
    database: 'ARAMPOMPE'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/api', (req, res) => {
    console.log('API endpoint');
});

// Fetch Riot account information
app.get('/api/riot/account/:gameName/:tagGame', async (req, res) => {
    const { gameName, tagGame } = req.params;
    try {
        const response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagGame}`, {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching riot data:', error);
        res.status(500).send('Error fetching riot data');
    }
});

// Fetch last match information
app.get('/api/riot/matches/:uuid', async (req, res) => {
    const { uuid } = req.params;
    try {
        const responseMatchsId = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${uuid}/ids?start=0&count=20`, {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        });
        const matchIds = responseMatchsId.data;
        const responseMatch = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchIds[0]}`, {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        });
        res.json(responseMatch.data);
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).send('Error fetching match data');
    }
});

// Register user
app.post('/api/users/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).send('Username, password, and email are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format');
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        console.log('Password hash:', passwordHash);
        const sql = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';

        db.query(sql, [username, passwordHash, email], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username or email already exists');
                }
                console.error('Error registering user:', err);
                return res.status(500).send('Error registering user');
            }
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Error registering user');
    }
});

// Login user
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).send('Error logging in user');
            }

            if (results.length === 0) {
                return res.status(400).send('Invalid username or password');
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(400).send('Invalid username or password');
            }
            res.status(201).send('User logged successfully');
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error logging in user');
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
