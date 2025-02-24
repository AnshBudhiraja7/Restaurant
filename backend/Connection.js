const mysql=require("mysql")
require("dotenv").config()

const connectDB=()=>{
    // create connection
    const connect=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:process.env.MYSQL_PASSWORD
    })
    // connection build
    connect.connect((error)=>{
       if(error) return console.log("Error Occured in Connecting MySQL!");
       console.log("Connected To MySQL...");
    })
    // database creation
    const dbQuery=`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`
    connect.query(dbQuery,(error)=>{
        if(error) return console.log("Error Occured in Creating Database:"+error);
        console.log(process.env.DATABASE+" Database Created Successfully!");
    })
    // select database
    connect.changeUser({database:process.env.DATABASE},(error)=>{
        if(error) return console.log("Error Occured in selecting Database:"+error);
        console.log(process.env.DATABASE+" Database Selected");
    })
    return connect
}
module.exports=connectDB