const express=require("express")
const cors=require("cors")
const Connection=require("./Connection")
const User=require("./Model/UserModel")
const app=express()
app.use(cors())
app.use(express.json())
const PORT=3010
Connection()

app.post("/createUser",async(req,resp)=>{
    const {name,phone,email,password}= req.body  // destructure of object
    // console.log({name,phone,email,password});  structuring of object

    if(name && phone && email && password){
        const existingUser= await User.findOne({email})
        if(existingUser){
            resp.status(400).send({message:"Account Already Exists"})
        }
        else{
           const newUser= await User.create({name,phone,email,password})
           resp.status(201).send({message:"Account Created Successfully",newUser})
        }
    }
    else{
        resp.status(404).send({message:"Field is empty"})
    }
})

app.post("/login",async(req,resp)=>{
    const {email,password} =req.body

    if(email && password){
       const existingUser=await User.findOne({email})
       if(existingUser){
            if(existingUser.password==password){
                resp.status(200).send({message:"Login Successfully",id:existingUser._id})
            }
            else{
                resp.status(401).send({message:"Invalid Password"})
            }
       }
       else{
        resp.status(401).send({message:"Invalid Email"})
       }
    }
    else{
        resp.status(404).send({message:"Field is empty"})
    }
})

app.listen(PORT,()=>{
    console.log("Server Started At:"+PORT);  
})