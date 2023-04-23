const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database and open a connection to it
const db = new sqlite3.Database('./songs.db');

// Create a table for storing songs
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT, createTime INTEGER, authorName TEXT)');
})


// Create a new song
router.post('/', (req, res) => {
    const { body, authorName } = req.body;

    const createTime = Date.now();

    db.run('INSERT INTO songs (body, createTime, authorName) VALUES (?, ?, ?)', [body, createTime, authorName], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        res.sendStatus(201);
    });
});

// Get all songs
router.get('/', (req, res) => {
    db.all('SELECT * FROM songs', (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM songs WHERE id = ?';
    const id = req.params.id;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else if (!row) {
            res.status(404).send('Song not found');
        } else {
            res.send(row);
        }
    });
});

// Update a song
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { body, authorName } = req.body;

    db.run('UPDATE songs SET body = ?, authorName = ? WHERE id = ?', [body, authorName, id], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        res.sendStatus(204);
    });
});

// Delete a song
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM songs WHERE id = ?', id, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        res.sendStatus(204);
    });
});

module.exports = router;
