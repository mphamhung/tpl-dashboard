const mysql = require('mysql2')
require('dotenv').config();
// Create the connection to the database
const connection = mysql.createConnection(process.env.DATABASE_URL)

module.exports = connection.promise(); // Export the promise-based connection