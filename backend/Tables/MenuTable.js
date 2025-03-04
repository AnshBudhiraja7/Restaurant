const connection = require('../Connection')();
require("dotenv").config()

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.MENU_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        itemname VARCHAR(255) NOT NULL,
        category_id INT NOT NULL,
        user_id INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES ${process.env.CATEGORY_TABLE}(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES ${process.env.USER_TABLE}(id) ON DELETE CASCADE
    )`;

connection.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log(`Table ${process.env.MENU_TABLE} is ready`);
    }
});

module.exports = connection;