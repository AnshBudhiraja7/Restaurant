const crypto=require("crypto")
const otpmap=new Map()

const generateotp=(email)=>{
    const number= crypto.randomInt(0,1000000)
    const otp=String(number).padStart(6,"7")
    otpmap.set(email,otp)
    return otp
}


const verifyotp=(email,otp)=>{
    const otpentry=otpmap.get(email)
    if(!otpentry) return {status:false,message:"OTP is not found or expired"}
    if(otpentry===otp){
    otpmap.delete(email);
    return {status:true,message:"Otp Matched Successful"}
    }
    return {status:false,message:'Invalid OTP'}
}
module.exports={generateotp,verifyotp}