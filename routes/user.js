const router = require('express').Router()
const db = require('../services/database')

// USER ROUTES

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [ result ] = await db.query('SELECT * FROM users WHERE id = ?', [ id ])

        res.json(result)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.patch('/', async (req, res) => {
    try {
        const { id, tokens } = req.body
        const result = await db.query('UPDATE users SET tokens = ? WHERE id = ?', [ tokens, id ])
        
        res.status(400).json(result)
    } catch (error) {
        res.json({ message: 'BAD REQUEST', error: error.message })
    }
})

// USER ACTIONS

router.post('/transfer/:transferTo', async (req, res) => {
    try {
        const { id, amountToTransfer } = req.body
        const { transferTo } = req.params

        const [ [ userExists ] ] = await db.query('SELECT * FROM users WHERE id = ?', [ transferTo ])

        if (!userExists) {
            return res.status(400).json({ error: 'USER NOT FOUND', message: 'Usuário não encontrado!' })
        }

        const userReceivedResponse = await db.query('UPDATE users SET tokens = tokens + ? WHERE id = ?', [ amountToTransfer, transferTo ])
        const userSentResponse = await db.query('UPDATE users SET tokens = tokens - ? WHERE id = ?', [ amountToTransfer, id ])
        
        res.status(400).json({ userReceivedResponse, userSentResponse, message: 'SUCCESS' })
    } catch {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.post('/deposit', async (req, res) => {
    try {
        const { id, amountToDeposit } = req.body
        const result = await db.query('UPDATE users SET tokens = tokens + ? WHERE id = ?', [ amountToDeposit, id ])
        
        res.json(result)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

module.exports = router