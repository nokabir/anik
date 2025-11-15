const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from the root directory

const DB_FILE = './db.json';

// Helper function to read the database
const readDB = () => {
    const db = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(db);
};

// Helper function to write to the database
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// GET all tournaments
app.get('/api/tournaments', (req, res) => {
    const db = readDB();
    res.json(db.tournaments);
});

// POST a new tournament
app.post('/api/tournaments', (req, res) => {
    const db = readDB();
    const newTournament = {
        id: db.tournaments.length > 0 ? Math.max(...db.tournaments.map(t => t.id)) + 1 : 1,
        ...req.body
    };
    db.tournaments.push(newTournament);
    writeDB(db);
    res.status(201).json(newTournament);
});

// DELETE a tournament
app.delete('/api/tournaments/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id, 10);
    const tournamentIndex = db.tournaments.findIndex(t => t.id === id);

    if (tournamentIndex === -1) {
        return res.status(404).json({ message: 'Tournament not found' });
    }

    db.tournaments.splice(tournamentIndex, 1);
    writeDB(db);
    res.status(204).send(); // No Content
});

// PUT (update) a tournament
app.put('/api/tournaments/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id, 10);
    const tournamentIndex = db.tournaments.findIndex(t => t.id === id);

    if (tournamentIndex === -1) {
        return res.status(404).json({ message: 'Tournament not found' });
    }

    const updatedTournament = { ...db.tournaments[tournamentIndex], ...req.body };
    db.tournaments[tournamentIndex] = updatedTournament;
    writeDB(db);
    res.json(updatedTournament);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
