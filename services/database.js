const { createPool } = require('mysql2')
require('dotenv').config()

// DB CONFIG

module.exports = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).promise()