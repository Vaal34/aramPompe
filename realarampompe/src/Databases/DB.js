import mysql from 'mysql';

export function addUser(email) {
    const db = mysql.createPool({
        host: 'localhost',
        user: 'val34000',
        password: 'Val34000',
        database: 'ARAMPOMPE',
    });

    db.query('INSERT INTO your_table (email) VALUES (?)', [email], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }

        console.log('New user added to the database');
    });

    db.end();
}