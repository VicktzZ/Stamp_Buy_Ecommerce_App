const router = require('express').Router()
const db = require('../services/database')
const { generateProductCards } = require('../utils/server')


// PRODUCTS ROUTES

// RENDER
router.get('/render', async (req, res) => {
    try {
        const [ products ] = await db.query('SELECT * FROM products')
        
        // RENDER PRODUCTS FUNCTION
        const productCards = generateProductCards(products)

        // Sending HTML Product Cards
    
        const prodCardsHTMLString = String(productCards).replace(/ ,/g, '')

        res.send(prodCardsHTMLString)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const [ products ] = await db.query('SELECT * FROM products')

        res.status(200).json(products)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const [ [ product ] ] = await db.query('SELECT * FROM products WHERE id = ?', [ id ])

        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        // Get product data
        const { name, price, img, discounts } = req.body

        // Insert product data into the database
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

        // Send response
        res.status(200).json({ result, message: 'SUCCESS' })
    } catch {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

module.exports = router