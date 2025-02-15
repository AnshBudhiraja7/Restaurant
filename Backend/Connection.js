const mongoose=require("mongoose")

const Connection=async()=>{
   await mongoose.connect("mongodb://127.0.0.1:27017/Restaurant")
   return console.log("Connected To MongoDB");
}
module.exports=Connection