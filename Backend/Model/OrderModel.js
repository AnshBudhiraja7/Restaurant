const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    orderlist:{
        type:Array,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"Waiting"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Order=mongoose.model("orders",orderSchema)
module.exports=Order