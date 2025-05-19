const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sanatSQL@2025',
    database: 'money_manager',
    port:3306
});

connection.connect((err) => {
    if(err) {
        console.error("DB connection failed:",err);
        return;
    }
    console.log("Connected to Local MySQL DB!");
});

module.exports = connection;

