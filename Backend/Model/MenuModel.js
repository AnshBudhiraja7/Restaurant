const mongoose=require("mongoose")

const menuSchema=new mongoose.Schema({
    item:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Menu=mongoose.model("menus",menuSchema)
module.exports=Menu