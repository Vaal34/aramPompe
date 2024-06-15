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

const RIOT_API_KEY = 'RGAPI-b8b2c559-b1f0-4553-b967-44520a433b72';
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

    const checkUserQuery = 'SELECT * FROM users_log WHERE username = ? OR email = ?';
    db.query(checkUserQuery, [username, email], async (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).send('Error registering user');
        }

        if (result.length > 0) {
            const existingUser = result[0];
            if (existingUser.username === username) {
                return res.status(400).send('Username already exists');
            } else if (existingUser.email === email) {
                return res.status(400).send('Email already exists');
            }
        }

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

                const friendsProfile = [];
                const targetsProfile = [];
                const sqlInsertUserInfo = 'INSERT INTO user_info (user_id, targets_profile, friends_profile, current_target) VALUES (?, ?, ?, ?)';
                db.query(sqlInsertUserInfo, [userId, JSON.stringify(friendsProfile), JSON.stringify(targetsProfile), ""], (err, result) => {
                    if (err) {
                        console.error('Error inserting user info:', err);
                        return res.status(500).send('Error registering user');
                    }

                    const sqlInsertUserStat = 'INSERT INTO user_stat (user_id, pompe, calorie, username) VALUES (?, ?, ?, ?)';
                    db.query(sqlInsertUserStat, [userId, 0, 0, username], (err, result) => {
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
                { expiresIn: '10h' }
            );
            console.log('Token:', token);
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.cookie('username', user.username, { secure: process.env.NODE_ENV === 'production' });
            res.json({ message: 'Login successful', username: user.username });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error logging in user');
    }
});

// Logout user
app.post('/api/users/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(200).send('Logged out successfully');
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
    const { user_id, friend } = req.body;

    const sqlSelect = `SELECT friends_profile FROM user_info WHERE user_id = ?`;
    db.query(sqlSelect, [user_id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération du profil des amis :', err);
            return res.status(500).send('Erreur lors de la récupération du profil des amis');
        }

        let friendsProfile = result[0].friends_profile;
        friendsProfile.push(friend);

        const sqlUpdate = `UPDATE user_info SET friends_profile = ? WHERE user_id = ?`;
        db.query(sqlUpdate, [JSON.stringify(friendsProfile), user_id], (err, result) => {
            if (err) {
                console.error('Erreur lors de la mise à jour du profil des amis :', err);
                return res.status(500).send('Erreur lors de la mise à jour du profil des amis');
            }
            console.log(`Ami ${friend} ajouté avec succès`);
            res.status(200).send('Profil des amis mis à jour avec succès');
        });
    });
});


app.post('/api/user/friends/deletefriend', authenticateToken, async (req, res) => {
    const { user_id, friend } = req.body.data;
    const sql = `SELECT friends_profile from user_info WHERE user_id = ?`;
    let listFriend = [];
    db.query(sql, [user_id], (err, result) => {
        listFriend = result[0].friends_profile;
        listFriend = listFriend.filter(f => f !== friend);

        updateSQL = `UPDATE user_info SET friends_profile = ? WHERE user_id = ?`;
        db.query(updateSQL, [JSON.stringify(listFriend), user_id], (err, result) => {
            if (err) {
                console.error('Error updating friends profile:', err);
                return res.status(500).send('Error updating friends profile');
            }
            console.log(`Friends ${friend} delete successfully`);
            res.status(200).send('Friends profile updated successfully');
        });
    });
});

// Target Profile
app.post('/api/user/targets/addtarget', authenticateToken, (req, res) => {
    const { user_id, target } = req.body;

    const sqlSelect = `SELECT targets_profile FROM user_info WHERE user_id = ?`;
    db.query(sqlSelect, [user_id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération du profil des cibles :', err);
            return res.status(500).send('Erreur lors de la récupération du profil des cibles');
        }

        let targetsProfile = result[0].targets_profile;
        targetsProfile.push(target);

        const sqlUpdate = `UPDATE user_info SET targets_profile = ? WHERE user_id = ?`;
        db.query(sqlUpdate, [JSON.stringify(targetsProfile), user_id], (err, result) => {
            if (err) {
                console.error('Erreur lors de la mise à jour du profil des cibles :', err);
                return res.status(500).send('Erreur lors de la mise à jour du profil des cibles');
            }
            console.log(`Cible ${target} ajoutée avec succès`);
            res.status(200).send('Profil des cibles mis à jour avec succès');
        });
    });
});


app.post('/api/user/targets/deletetarget', authenticateToken, async (req, res) => {
    const { user_id, target } = req.body.data;
    const sql = `SELECT targets_profile from user_info WHERE user_id = ?`;
    let listTarget = [];
    db.query(sql, [user_id], (err, result) => {
        listTarget = result[0].targets_profile;
        listTarget = listTarget.filter(t => t !== target);

        updateSQL = `UPDATE user_info SET targets_profile = ? WHERE user_id = ?`;
        db.query(updateSQL, [JSON.stringify(listTarget), user_id], (err, result) => {
            if (err) {
                console.error('Error updating targets profile:', err);
                return res.status(500).send('Error updating targets profile');
            }
            console.log(`Target ${target} delete successfully`);
            res.status(200).send('Targets profile updated successfully');
        });
    });
});

app.post('/api/user/targets/currenttarget', authenticateToken, async (req, res) => {
    const { user_id, target } = req.body;
    const sql = `UPDATE user_info SET current_target = ? WHERE user_id = ?`;
    db.query(sql, [target, user_id], (err, result) => {
        if (err) {
            console.error('Error updating current target:', err);
            return res.status(500).send('Error updating current target');
        }
        console.log(`Current target ${target} updated successfully`);
        res.status(200).send('Current target updated successfully');
    });
});

app.get('/api/user/targets/currenttarget/:user_id', authenticateToken, (req, res) => {
    const { user_id } = req.params;
    const sql = `SELECT current_target FROM user_info WHERE user_id = ?`;
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Error fetching current target:', err);
            return res.status(500).send('Error fetching current target');
        }
        res.status(200).json({ currentTarget: result[0].current_target });
    });
});

app.get('/api/user/user_stats/classement', authenticateToken, (req, res) => {
    const sql = `SELECT username, pompe, calorie FROM user_stat ORDER BY pompe DESC`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching user stats:', err);
            return res.status(500).send('Error fetching user stats');
        }
        res.json(result);
    });
})

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

app.get('/api/user_stats/all/search', authenticateToken, (req, res) => {
    const query = req.query.query;
    const sql = `SELECT * FROM user_stat WHERE username LIKE ?`;
    db.query(sql, [`%${query}%`], (err, result) => {
        if (err) {
            console.error('Error fetching user stats:', err);
            return res.status(500).send('Error fetching user stats');
        }
        res.json(result);
    });
});

app.post('/api/match/create', authenticateToken, (req, res) => {
    console.log(req.body)
    const { joueur, match_id } = req.body;
    const sql = `INSERT INTO party (joueur, match_id, pompe) VALUES (?, ?, ?)`;
    db.query(sql, [joueur, match_id, 0], (err, result) => {
        if (err) {
            console.error('Error creating match:', err);
            return res.status(500).send('Error creating match');
        }
        res.status(201).send('Match created successfully');
    });
});

app.get('/api/match/:match_id', authenticateToken, (req, res) => {
    const { match_id } = req.params;
    const sql = `SELECT joueur, pompe FROM party WHERE match_id = ?`;
    db.query(sql, [match_id], (err, result) => {
        if (err) {
            console.error('Error fetching match:', err);
            return res.status(500).send('Error fetching match');
        }
        res.json(result);
    });
})

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
