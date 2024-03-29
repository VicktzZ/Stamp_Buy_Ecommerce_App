// Imports

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const { authRoutes, productRoutes, userRoutes } = require('./routes')

const app = express()

// CONFIG

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(bodyParser.json() )
app.use(express.urlencoded({ extended: false }))

// API ROUTES

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/product', productRoutes)

// RENDERING ROUTES

app.use('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'))
})

app.use('/selos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'selos.html'))
})

app.use('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'produtos.html'))
})

//  Page not found handler
app.use((req, res) => {
    res.status(404)
    res.send('NOT FOUND')
})

// SERVER START

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
})