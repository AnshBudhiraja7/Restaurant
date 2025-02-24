const express =require("express")
const { handleResponse, handleError } = require("../Responses/Responses")
const Users=require("../Tables/UserTable")
const Routes=express.Router()
Routes.get("/",(req,resp)=>resp.status(200).send({message:"Server Health is Okay!"}))

Routes.post("/createUser",(req,resp)=>{
    const {name,phone,email,password}=req.body
    if(!name || !phone || !email || !password) return handleResponse(resp,404,"All fields are required")

    const dbQuery=`Select * from ${process.env.USER_TABLE} where email='${email}'`
    Users.query(dbQuery,(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,404,"Not Found")
        return handleResponse(resp,202,"Okay",results)
    })
})

module.exports=Routes