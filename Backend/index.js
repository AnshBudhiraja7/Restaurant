const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const multer=require("multer")
const fs=require("fs")
const Connection=require("./Connection")
const User=require("./Model/UserModel")
const Menu=require("./Model/MenuModel")
const app=express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));
const PORT=3010
Connection()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdir("./uploads/",{recursive:true},(err)=>{
            if(err) return cb(err,null)
            else cb(null, 'uploads/');
        })
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage});

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


app.post("/createMenu",upload.single("image"),async(req,resp)=>{
    const {item,price,category,description}=req.body
    
    if(item && price && category && description){
        if(req.file.path){
            const newMenu=await Menu.create({item,price,category,description,image:"./uploads/"+req.file.filename})
            resp.status(201).send({message:"Menu is uploaded successfully",newMenu})
        }
        else{
            resp.status(404).send({message:"Image is not uploaded"})
        } 
    }
    else{
        resp.status(404).send({message:"Field is Empty"})
    }
})
app.get("/getAllMenus",async(req,resp)=>{
    const result=await Menu.find({})
    if(result && result.length!=0){
        resp.status(202).send({message:"Menus fetched successfully",result})
    }
    else{
        resp.status(404).send({message:"Menus not exists"})
    }
})
app.delete("/deleteMenu/:id",async(req,resp)=>{
    const {id}=req.params
    
    if(mongoose.isValidObjectId(id)){
       const existingMenu=await Menu.findOne({_id:id})
       if(existingMenu){
        fs.unlink(existingMenu.image,(error)=>{
            if (error){
                resp.status(500).send({message:"Error Occured in deleting the image",error})
            }
        })
        const result=await Menu.deleteOne({_id:id})
        resp.status(202).send({message:"Menu deleted succesfully",result})
       }
       else{
        resp.status(404).send({message:"Menu of this id is not found"})
       }
    }
    else{
        resp.status(401).send({message:"Object id is invalid"})
    }  
})




app.listen(PORT,()=>{
    console.log("Server Started At:"+PORT);  
})