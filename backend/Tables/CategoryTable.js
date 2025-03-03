const connection = require('../Connection')();
require("dotenv").config()
const createCategoryTableQuery = `CREATE TABLE IF NOT EXISTS ${process.env.CATEGORY_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES ${process.env.USER_TABLE}(id) ON DELETE CASCADE
    );`

connection.query(createCategoryTableQuery, (err) => {
    if (err) {
        console.error(`Error creating ${process.env.CATEGORY_TABLE} table: ${err}`);
    } else {
        console.log(`Table ${process.env.CATEGORY_TABLE} is ready`);
    }
});
module.exports = connection;