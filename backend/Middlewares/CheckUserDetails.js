const jwt=require("jsonwebtoken")
require("dotenv").config()
const {handleResponse,handleError}=require("../Responses/Responses")
const User=require("../Tables/UserTable")

const checkUserDetails=async(req,resp,next)=>{
    const token=req.header("Authorization")
    if(!token) return handleResponse(resp,404,"Token is not found")
    const payload=jwt.verify(token,process.env.JWT_KEY)
    if(!payload || !payload.id) return handleResponse(resp,401,"Token is not valid")
    const Query=`Select * from ${process.env.USER_TABLE} where id=${payload.id}`
    User.query(Query,(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,401,"Unauthorised user")
        if(results[0].role!=="owner") return handleResponse(resp,401,"Unauthorised User")
        req.user=results[0]
        next()
    })
}

const checkSuperAdminDetails=async(req,resp,next)=>{
    const token=req.header("Authorization")
    if(!token) return handleResponse(resp,404,"Token is not found")
    const payload=jwt.verify(token,process.env.JWT_KEY)
    if(!payload || !payload.id) return handleResponse(resp,401,"Token is not valid")
    const Query=`Select * from ${process.env.USER_TABLE} where id=${payload.id}`
    User.query(Query,(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,401,"Unauthorised user")
        if(results[0].role!=="superadmin") return handleResponse(resp,401,"Unauthorised User")
        req.user=results[0]
        next()
    })
}
module.exports={checkUserDetails,checkSuperAdminDetails}