const mysql = require('mysql2');
const dotenv = require('dotenv');  /// import a required library

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,      // example: localhost
  user: process.env.DB_USER,      // example: root
  password: process.env.DB_PASS,  // your MySQL password
  database: process.env.DB_NAME   // example: expense_db
});

db.connect((err) => {
    if (err){
        console.log(`Error`,err);
    }
    else{
        console.log(`DataBase is Connected`);
    }
});

module.exports = db;
