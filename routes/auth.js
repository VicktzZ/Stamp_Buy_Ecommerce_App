const router = require('express').Router()
const db = require('../services/database')

// AUTHENTICATION

// Handle user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const [ result ] = await db.query(`SELECT email, username, tokens, id FROM users WHERE email = ? AND password = ?`, [ email, password ])
        
        res.json(result)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

// Handle user signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        // Insert user data into the database
        const result = await db.query(`
            INSERT INTO users (email, password, username)
            VALUES (?, ?, ?);
        `, [ email.toLowerCase(), password, username ]);
        
        res.json(result);
    } catch (error) {
        // Handle error
        res.status(400).json({ message: 'BAD REQUEST', error: error.message });
    }
});

module.exports = router