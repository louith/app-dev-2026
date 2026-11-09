require("dotenv").config();
const mysql = require("mysql2/promise");

const base = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
};

const db = mysql.createPool({ ...base, database: process.env.DB_NAME });
const academic = mysql.createPool({
  ...base,
  database: process.env.ACADEMIC_DB_NAME, //only thing that changed is the db name
});

module.exports = { db, academic };
