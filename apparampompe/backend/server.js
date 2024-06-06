const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')
const app = express();
const PORT = 5000;

const RIOT_API_KEY = 'RGAPI-e14b25d0-78e9-4db2-999b-57b9c1676493';
const JWT_SECRET = 'ARAMPOMPE';

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const db = mysql.createConnection({
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
    res.send('API endpoint');
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
        return res.status(500).send('Error fetching riot data');
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

    db.query('SELECT * FROM users_log WHERE username = ?', [username], async (err, result) => {
        if (result.length > 0) {
            return res.status(400).send('Username already exists');
        } else {
            try {
                const passwordHash = await bcrypt.hash(password, 10);
                console.log('Password hash:', passwordHash);

                const userId = uuidv4();
                const sqlInsertUser = 'INSERT INTO users_log (id, username, password_hash, email) VALUES (?, ?, ?, ?)';
                db.query(sqlInsertUser, [userId, username, passwordHash, email], (err, result) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        return res.status(500).send('Error registering user');
                    }

                    const sqlInsertUserInfo = 'INSERT INTO user_info (user_id, targets_profile, friends_profile) VALUES (?, ?, ?)';
                    db.query(sqlInsertUserInfo, [userId, JSON.stringify({}), JSON.stringify({})], (err, result) => {
                        if (err) {
                            console.error('Error inserting user info:', err);
                            return res.status(500).send('Error registering user');
                        }

                        const sqlInsertUserStat = 'INSERT INTO user_stat (user_id, pompe, calorie) VALUES (?, ?, ?)';
                        db.query(sqlInsertUserStat, [userId, 0, 0], (err, result) => {
                            if (err) {
                                console.error('Error inserting user stat:', err);
                                return res.status(500).send('Error registering user');
                            }

                            return res.status(201).send('User registered successfully');
                        });
                    });
                });
            } catch (error) {
                console.error('Error registering user:', error);
                return res.status(500).send('Error registering user');
            }
        }
    });
});

// Login user
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const sql = 'SELECT * FROM users_log WHERE username = ?';
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).send('Error logging in user');
            }

            if (results.length === 0) {
                return res.status(400).send('Invalid username or password');
            }

            const user = results[0];
            console.log('User:', user);
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(400).send('Invalid username or password');
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            console.log('Token:', token);
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.json({ message: 'Login successful', username: user.username });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error logging in user');
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];
    if (!token) {
        console.log('No token found');
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.get('/api/users/current', authenticateToken, (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        res.json({ id: req.user.id, username: req.user.username, email: req.user.email });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/user/:id', authenticateToken, (request, response) => {
    const { id } = request.params;
    const sql = `SELECT * FROM users_log WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return response.status(500).send('Error fetching user');
        }

        if (result.length === 0) {
            return response.status(404).send('User not found');
        }

        response.json(result[0]);
    });
});


//  user_info
app.post('/api/user/friends/addfriend', authenticateToken, (req, res) => {
    const { user_id, friends_profile } = req.body;

    const sql = `UPDATE user_info SET friends_profile = ? WHERE user_id = ?`;
    db.query(sql, [JSON.stringify(friends_profile), user_id], (err, result) => {
        if (err) {
            console.error('Error updating friends profile:', err);
            return res.status(500).send('Error updating friends profile');
        }
        console.log('Friends profile updated successfully');
        res.status(200).send('Friends profile updated successfully');
    });
});

app.post('/api/user/friends/deletefriend', authenticateToken, async (req, res) => {
    const { user_id, friend } = req.body.data;
    const sql = `SELECT friends_profile from user_info WHERE user_id = ?`;
    let listFriend = [];
    db.query(sql, [user_id], (err, result) => {
        console.log(result);
        listFriend = result[0].friends_profile;
        listFriend = listFriend.filter(f => f !== friend);

        updateSQL = `UPDATE user_info SET friends_profile = ? WHERE user_id = ?`;
        db.query(updateSQL, [JSON.stringify(listFriend), user_id], (err, result) => {
            if (err) {
                console.error('Error updating friends profile:', err);
                return res.status(500).send('Error updating friends profile');
            }
            console.log('Friends profile updated successfully');
            res.status(200).send('Friends profile updated successfully');
        });
    });
});

app.get('/api/user/user_info/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM user_info WHERE user_id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).send('Error fetching user info');
        }

        if (result.length === 0) {
            return res.status(404).send('User info not found');
        }

        res.json(result[0]);
    });
})

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
