const router = require('express').Router()
const db = require('../services/database')

router.get('/', (req, res) => {
    const users = db.query('SELECT * FROM users')
    res.json(users)
})

// AUTHENTICATION

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const [ result ] = await db.query(`SELECT email, username, tokens, id FROM users WHERE email = ? AND password = ?`, [ email, password ])
        
        res.json(result)
    } catch (error) {
        res.json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.post('/auth/signup', async (req, res) => {
    try {
        const { email, password, username } = req.body
        const result = await db.query(`
            INSERT INTO users (email, password, username)
            VALUES (?, ?, ?);
        `, [ email.toLowerCase(), password, username ])
        
        res.json(result)
    } catch (error) {
        res.json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.patch('/user', async (req, res) => {
    try {
        const { id, tokens } = req.body
        const result = await db.query('UPDATE users SET tokens = ? WHERE id = ?', [ tokens, id ])
        
        res.json(result)
    } catch (error) {
        res.json({ message: 'BAD REQUEST', error: error.message })
    }
})

module.exports = router