const connect=require("../Connection")()
require("dotenv").config()

const userQuery=`
    CREATE TABLE IF NOT EXISTS ${process.env.USER_TABLE}(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updatedAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`

connect.query(userQuery,(error,result)=>{
    if(error) return console.log("Error Occured in creating "+process.env.USER_TABLE+" table :"+error);
    console.log(process.env.USER_TABLE+" Table is ready!");
})
module.exports=connect