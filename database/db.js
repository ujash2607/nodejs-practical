const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "alabs@2020",
    port: "5432",
    host: "localhost",
    database: "users_details"    
});

console.log("Database connected !!");

module.exports = pool;