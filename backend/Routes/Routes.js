const express =require("express")
const jwt=require("jsonwebtoken")
const multer =require("multer")
const fs=require("fs")

const { handleResponse, handleError } = require("../Responses/Responses")
const Users=require("../Tables/UserTable")
const Category=require("../Tables/CategoryTable")
const Menu=require("../Tables/MenuTable")
const { generateotp, verifyotp } = require("../Services/OTPService/OTPService")
const { otptoemailforverification } = require("../Services/EmailService/EmailService")
const {checkUserDetails} = require("../Middlewares/CheckUserDetails")

const Routes=express.Router()

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
const upload=multer({storage:storage})
const deleteImage=(path)=>{
    fs.unlink(path,(error)=>{
        console.log("Error Occured in deleting the image:"+error);        
    })
}


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


Routes.post('/createCategory',checkUserDetails,(req, resp) => {
    const { name } = req.body;

    if (!name) return handleResponse(resp,404,"Category name is required")

     // Check if category exists
     const checkQuery = `SELECT id FROM ${process.env.CATEGORY_TABLE} WHERE name = '${name}' and user_id='${req.user.id}'`;
     Category.query(checkQuery, (error, results) => {
         if (error) return handleError(resp,error)
 
         if (results.length !== 0) {
            return handleResponse(resp,400,"This Category already exists.")
         }
 
         // Insert if not exists
         const insertQuery = `INSERT INTO ${process.env.CATEGORY_TABLE} (name,user_id) VALUES (?,?)`;
         Category.query(insertQuery, [name,req.user.id], (error, result) => {
             if (error) return handleError(resp,error)
 
             return handleResponse(resp,201,"Category Created Successfully",result)
         });
     });
});
Routes.get('/getAllCategories',checkUserDetails,(req, resp) => {
    const Query = `SELECT * FROM ${process.env.CATEGORY_TABLE} where user_id=?`;

    Category.query(Query,[req.user.id],(error, results) => {
        if (error) return handleError(resp,error)
        return handleResponse(resp,202,"Categories fetched successfully",results)
    });
});

// api we done in batch
Routes.post("/addMenus",checkUserDetails,upload.single("image"),(req,resp)=>{
   const { itemname, price, category,description} = req.body;
   
   if (!itemname || !price || !category) {
        if(req.file) deleteImage("./uploads/"+req.file.filename)
        return handleResponse(resp,404,"Field is empty")
   }
    
   if(!req.file) return handleResponse(resp,404,"Plz upload the image")

    const categoryQuery=`Select id from ${process.env.CATEGORY_TABLE} where name='${category}'`
    Category.query(categoryQuery,(error,results)=>{
        if(error){
            deleteImage("./uploads/"+req.file.filename)
            return handleError(resp,error)
        } 
        if(results.length===0) {
            deleteImage("./uploads/"+req.file.filename)
            return handleResponse(resp,404,"This category not exists in your category list")
        }
        
        const category_id=results[0].id
        
        const insertQuery=`INSERT INTO ${process.env.MENU_TABLE} (itemname, price, category_id, description, image) VALUES (?, ?, ?, ?, ?)`
        Menu.query(insertQuery,[itemname,price,category_id,description,"./uploads/"+req.file.filename],(error,result)=>{
            if(error) {
                deleteImage("./uploads/"+req.file.filename)
                return handleError(resp,error)
            }
            return handleResponse(resp,201,"Menu created Successfully",result)
        })  
    })
})

Routes.get('/getAllItems',checkUserDetails,(req, resp) => {
    const query=`SELECT menu_items.id, menu_items.itemname, menu_items.image, menu_items.price, menu_items.description, menu_items.category_id,categories.name AS category_name FROM menu_items JOIN categories ON menu_items.category_id = categories.id ORDER BY menu_items.id ASC`
   
    Menu.query(query, (error, results) => {
        if (error) return handleError(resp,error);
        if(results.length===0) return handleResponse(resp,400,"Table is empty")
        return handleResponse(resp,202,"Fetched successfully",results)
    });
});


// api prepared for the batch
// Routes.post('/addItem', upload.single('image'),(req, resp) => {
//     const { itemname, price, category, description } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!itemname || !image || !price || !category || !description) {
//         deleteImage(image,resp)
//         return resp.status(400).json({ message: 'All fields are required' });
//     }

//     const checkQuery = 'SELECT id FROM categories WHERE name = ?';
//     Category.query(checkQuery, [category], (error, results) => {
//         if (error){
//             deleteImage(image,resp)
//             return resp.status(500).json({message:"Error finding in category",error})
//         }
//         if(results.length===0){
//             deleteImage(image,resp)
//             return resp.status(404).json({message:"This Category does not exists in your list"})
//         }
//         const categoryID=results[0].id
//         const query = `INSERT INTO menu_items (itemname, image, price, category_id, description) VALUES (?, ?, ?, ?, ?)`;
//         Menu.query(query, [itemname, image, price, categoryID, description], (error, result) => {
//             if (error) {
//                 deleteImage(image,resp)
//                 return resp.status(500).json({ message: 'Database error',error });
//             }
//             return resp.status(201).json({ message: 'Menu item added successfully', id: result.insertId });
//         });
//     })
// })


module.exports=Routes