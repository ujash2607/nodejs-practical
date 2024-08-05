const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.dbUser,
    password: process.env.dbPass,
    port: process.env.dbPort,
    host: process.env.dbHost,
    database: process.env.dbName    
});

console.log("Database connected !!");

module.exports = pool;