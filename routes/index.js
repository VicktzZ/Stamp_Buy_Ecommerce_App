const router = require('express').Router()
const db = require('../services/database')

// AUTHENTICATION

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const [ result ] = await db.query(`SELECT email, username, tokens, id FROM users WHERE email = ? AND password = ?`, [ email, password ])
        
        res.json(result)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
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
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

// USER ROUTES

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [ result ] = await db.query('SELECT * FROM users WHERE id = ?', [ id ])

        res.json(result)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.patch('/user', async (req, res) => {
    try {
        const { id, tokens } = req.body
        const result = await db.query('UPDATE users SET tokens = ? WHERE id = ?', [ tokens, id ])
        
        res.status(400).json(result)
    } catch (error) {
        res.json({ message: 'BAD REQUEST', error: error.message })
    }
})

// USER ACTIONS

router.post('/user/transfer/:transferTo', async (req, res) => {
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

router.post('/user/deposit', async (req, res) => {
    try {
        const { id, amountToDeposit } = req.body
        const result = await db.query('UPDATE users SET tokens = tokens + ? WHERE id = ?', [ amountToDeposit, id ])
        
        res.json(result)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

// PRODUCTS ROUTES

router.get('/product', async (req, res) => {
    try {
        const [ result ] = await db.query('SELECT * FROM products')
        
        res.json(result)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.post('/product', async (req, res) => {
    try {
        const { name, price, img, discounts } = req.body

        const result = await db.query(`
            INSERT INTO products (
                name,
                price,
                img,
                first_discountTokenValue,
                first_discountValue,
                second_discountTokenValue,
                second_discountValue
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [ 
            name,
            price,
            img,
            discounts[0].tokenValue,
            discounts[0].value,
            discounts[1].tokenValue,
            discounts[1].value 
        ])

        res.status(200).json({ result, message: 'SUCCESS' })
    } catch {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }

    // {
    //     id: 1,
    //     name: 'Panela Philco',
    //     price: 24.99,
    //     img: 'images/panela.png',
    //     discounts: [
    //         {
    //             tokenValue: 80,
    //             value: 50
    //         },
    //         {
    //             tokenValue: 50,
    //             value: 35
    //         }
    //     ],
    // }
})

module.exports = router