const handleResponse=(resp,status,message,data=null)=>resp.status(status).json({message,data})
const handleError=(resp,error=null)=>resp.status(500).json({message:"Internal Server Error",error})
module.exports={handleResponse,handleError}