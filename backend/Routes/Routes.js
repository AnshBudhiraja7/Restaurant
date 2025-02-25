const express =require("express")
const { handleResponse, handleError } = require("../Responses/Responses")
const Users=require("../Tables/UserTable")
const { generateotp, verifyotp } = require("../Services/OTPService/OTPService")
const { otptoemailforverification } = require("../Services/EmailService/EmailService")
const jwt=require("jsonwebtoken")
const Routes=express.Router()
Routes.get("/",(req,resp)=>resp.status(200).send({message:"Server Health is Okay!"}))

Routes.post("/verifyUser",async(req,resp)=>{
    const {name,phone,email,password}=req.body
    if(!name || !phone || !email || !password) return handleResponse(resp,404,"All fields are required")

    const dbQuery=`Select * from ${process.env.USER_TABLE} where email='${email}'`
    Users.query(dbQuery,async(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length!==0) return handleResponse(resp,400,"Account related to this email already exists")
        const otp=generateotp(email)
        return await otptoemailforverification(resp,email,otp)
    })
})

Routes.post("/createUser",async(req,resp)=>{
    const {name,phone,email,password,otp}=req.body
    if(!name || !phone || !email || !password) return handleResponse(resp,404,"All fields are required")

    const dbQuery=`Select * from ${process.env.USER_TABLE} where email='${email}'`
    Users.query(dbQuery,async(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length!==0) return handleResponse(resp,400,"Account related to this email already exists")
        if(!otp) return handleResponse(resp,404,"Enter the otp")
        const result=verifyotp(email,otp)
        if(!result.status) return handleResponse(resp,401,result.message)
        
        const Query= `INSERT INTO \`${process.env.USER_TABLE}\` (\`name\`, \`phone\`, \`email\`, \`password\`, \`role\`) VALUES (?, ?, ?, ?, 'owner');`;
        Users.query(Query,[name,phone,email,password],(error,result)=>{
            if(error) return handleError(resp,error)
            return handleResponse(resp,201,"Account Created Successfully",result)
        })
    })
})

Routes.post("/login",(req,resp)=>{
    const {email,password}=req.body
    if(!email || !password) return handleResponse(resp,404,"All fields are required")

    const dbQuery=`Select * from ${process.env.USER_TABLE} where email='${email}'`
    Users.query(dbQuery,(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,401,"Invalid Email")
        if(results[0].password!==password) return handleResponse(resp,401,"Invalid Password")
        const payload={
            id:results[0].id
        }
        const token=jwt.sign(payload,process.env.JWT_KEY)
        return handleResponse(resp,202,"Login Successfully",{token,role:results[0].role})
    })
})

module.exports=Routes