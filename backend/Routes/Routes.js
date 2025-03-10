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

// multer storage
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
// delete image from server
const deleteImage=(path)=>{
    fs.unlink(path,(error)=>{
        if(error) console.log("Error Occured in deleting the image:"+error);        
    })
}


Routes.get("/",(req,resp)=>resp.status(200).send({message:"Server Health is Okay!"}))

// superadmin 
// otp send to email
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
// verify otp from email
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
// login
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

// owner
// create category
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
// get All Category
Routes.get('/getAllCategories',checkUserDetails,(req, resp) => {
    const Query = `SELECT * FROM ${process.env.CATEGORY_TABLE} where user_id=?`;

    Category.query(Query,[req.user.id],(error, results) => {
        if (error) return handleError(resp,error)
        return handleResponse(resp,202,"Categories fetched successfully",results)
    });
});

//add menu by owner
Routes.post("/addMenus",checkUserDetails,upload.single("image"),(req,resp)=>{
   const { itemname, price, category,description} = req.body;
   
   if (!itemname || !price || !category) {
        if(req.file) deleteImage("./uploads/"+req.file.filename)
        return handleResponse(resp,404,"Field is empty")
   }
    
   if(!req.file) return handleResponse(resp,404,"Plz upload the image")

    const categoryQuery=`Select id from ${process.env.CATEGORY_TABLE} where name='${category}' and user_id='${req.user.id}'`
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
        
        const insertQuery=`INSERT INTO ${process.env.MENU_TABLE} (itemname, price, category_id, description, image, user_id) VALUES (?, ?, ?, ?, ?, ?)`
        Menu.query(insertQuery,[itemname,price,category_id,description,"./uploads/"+req.file.filename,req.user.id],(error,result)=>{
            if(error) {
                deleteImage("./uploads/"+req.file.filename)
                return handleError(resp,error)
            }
            return handleResponse(resp,201,"Menu created Successfully",result)
        })  
    })
})
// get All menu for owner
Routes.get('/getAllItems',checkUserDetails,(req, resp) => {
    const query=`SELECT menu_items.id, menu_items.itemname, menu_items.image, menu_items.price, menu_items.description, menu_items.category_id,categories.name AS category_name FROM menu_items JOIN categories ON menu_items.category_id = categories.id where menu_items.user_id='${req.user.id}' ORDER BY menu_items.id ASC`
   
    Menu.query(query, (error, results) => {
        if (error) return handleError(resp,error);
        if(results.length===0) return handleResponse(resp,400,"Table is empty")
        return handleResponse(resp,202,"Fetched successfully",results)
    });
});
// get All menu for owner but for a particular category
Routes.get('/getAllItem/:category',checkUserDetails,(req, resp) => {
    const {category}=req.params
    if(!category) return handleResponse(resp,404,"Category is required")
    
    const CategoryQuery=`Select id from ${process.env.CATEGORY_TABLE} where name=? and user_id=?`
    Category.query(CategoryQuery,[category,req.user.id],(error,results)=>{
        if (error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,400,"Category is not found")
        
        const category_id=results[0].id

        const query=`SELECT menu_items.id, menu_items.itemname, menu_items.image, menu_items.price, menu_items.description, menu_items.category_id, categories.name AS category_name FROM menu_items JOIN categories ON menu_items.category_id = categories.id where menu_items.user_id='${req.user.id}' and menu_items.category_id='${category_id}' ORDER BY menu_items.id ASC`
        Menu.query(query, (error, responses) => {
            if (error) return handleError(resp,error);
            
            if(responses.length===0) return handleResponse(resp,400,"Table is empty")
            return handleResponse(resp,202,"Fetched successfully",responses)
        });
    })
});

// delete menu by owner
Routes.delete('/deleteItem/:id',checkUserDetails,(req, resp) => {
    const { id } = req.params;
    if (isNaN(id)) return handleResponse(resp,404,"Invalid Menu Id")

    Menu.query('SELECT image FROM menu_items WHERE id = ?', [id], (error, results) => {
        if (error) return handleError(resp,error)
        if (results.length === 0) return handleResponse(resp,400,"Menu not found in the list")

        if (results[0] && results[0].image) {
            deleteImage(results[0].image)

            const query = `DELETE FROM menu_items WHERE id = ?`;
            Menu.query(query, [id], (error, result) => {
                if (error) return handleError(resp,error)
                // if (result.affectedRows === 0) return resp.status(404).json({ message: 'Menu item not found' });
                
                return handleResponse(resp,202,"Menu deleted successfully")
            });
        }
    });
});
// update all fields except image of menu by owner
Routes.put('/updateItem/:id',checkUserDetails, (req, resp) => {
    const { id } = req.params;
    const { itemname, price, category, description } = req.body;

    if (isNaN(id)) {
        return handleResponse(resp,404,"Invalid Menu Id")
    }

    if (!itemname || !price || !category) {
        return handleResponse(resp,404,'All fields except image are required');
    }

    const checkQuery = 'SELECT id FROM categories WHERE name = ?';
    Category.query(checkQuery, [category], (error, results) => {
        if (error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,404,"This category is not exists")

        const categoryID=results[0].id


            Menu.query('SELECT * FROM menu_items WHERE id = ?', [id], (error, responses) => {
                if (error)  return handleError(resp,error)
                if (responses.length === 0) return handleResponse(resp,404,"Menu not found in the list")

                const query = `UPDATE menu_items SET itemname = ?, price = ?, category_id = ?, description = ? WHERE id = ?`;
                Menu.query(query, [itemname, price, categoryID, description, id], (error, result) => {
                    if (error)  return handleError(resp,error)
                    return handleResponse(resp,202,"Menu updated successfully!")
                });
            });
        })
});
// update only image of menu by owner
Routes.put("/updateItemImage/:id",checkUserDetails,upload.single('image'),(req,resp)=>{
    const { id } = req.params;

    if (isNaN(id)) {
        if (req.file) deleteImage(req?.file?.path)
        return handleResponse(resp,400,"Invalid Menu id")
    }

    if (!req.file) {
        return handleResponse(resp,400,"No image is uploaded yet!")
    }


    const newImagePath = `./uploads/${req.file.filename}`;
   
    Menu.query('SELECT image FROM menu_items WHERE id = ?', [id], (error, results) => {
            if (error) {
                deleteImage(newImagePath)
                return handleError(resp,error)
            }

            if (results.length === 0) {
                deleteImage(newImagePath)
                return handleResponse(resp,404,"Menu not found in the list")
            }

            const oldImagePath = results[0]?.image;

            const query = `UPDATE menu_items SET image = ? WHERE id = ?`;
            Menu.query(query, [newImagePath,id], (error, result) => {
                if (error) {
                    deleteImage(newImagePath)
                    return handleError(resp,error)
                }

                if (oldImagePath && oldImagePath !== newImagePath) {
                    deleteImage(oldImagePath)
                }
                return handleResponse(resp,202,'Menu item image updated successfully');
        });
    });
})
// common (customer)
// get All users
Routes.get("/getAllUsers",(req,resp)=>{
    const Query=`Select id,name,phone,email,role,createdAT from ${process.env.USER_TABLE} where role='owner'`
    Users.query(Query,(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,404,"User list is empty")
        return handleResponse(resp,202,"All Users fetched successfully",results)
    })
})
// get All menu of a particular user
Routes.get("/getAllMenus/:id",(req,resp)=>{
    const {id} = req.params
    if(isNaN(id)) return handleResponse(resp,400,"Restaurant id is invalid")

    const Query=`Select * from ${process.env.MENU_TABLE} where user_id=?`
    Menu.query(Query,[id],(error,results)=>{
        if(error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,404,"Menu list is empty")
        return handleResponse(resp,202,"All Menus fetched successfully",results)
    })
})

module.exports=Routes