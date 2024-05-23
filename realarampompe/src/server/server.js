const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'val34',
  password: 'root',
  database: 'ARAMPOMPE',
});

app.get('/', (request, response) => {
  return response.json(`server status: ${request.url}`)
})

app.get('/usersAUTH', (req, res) => {
  const sql = "SELECT * FROM usersAUTH";
  db.query(sql, (err, data) => {
    if(err){
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post('/usersAUTH', (req, res) => {
  const { email } = req.body;
  const sql = "INSERT INTO usersAUTH (email) VALUES (?)";
  db.query(sql, [email], (err, data) => {
    if(err){
      return res.json(err);
    }
    return res.json(data);
  });
});

app.listen(3001, () => {
  console.log('listening');
})