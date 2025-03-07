import React, { useEffect, useRef, useState } from 'react'
import AdminHeader from '../Components/AdminHeader';
import { useNavigate } from 'react-router-dom';
import Axios from '../../Axios';

const Owners = () => {
    const [menuItems, setMenuItems] = useState([]);
    const imageRef = useRef()
    const [image, setimage] = useState(null)
    const [categories, setcategories] = useState([])
    const [newItem, setNewItem] = useState({ name: "", price: "", description: "",category:"none" });
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const getAllCategories=async(token)=>{
      try {
        const response=await Axios.get("getAllCategories",{
        headers:{
          "Authorization":token
        }})
        setcategories(response?.data?.data)
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert('No response from server');
        } else {
          alert('An unexpected error occurred');
        }
      }
    }
    const getAllMenus=async(token)=>{
      try {
        const response=await Axios.get("getAllItems",{
        headers:{
          "Authorization":token
        }})
        setMenuItems(response?.data?.data)
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert('No response from server');
        } else {
          alert('An unexpected error occurred');
        }
      }
    }
    useEffect(()=>{
      const getdata=async()=>{
        const auth=JSON.parse(localStorage.getItem("Authorization"))
        if(auth && auth.token) {
          await getAllCategories(auth.token)
          return await getAllMenus(auth.token)
        }
        localStorage.clear()
        return navigate("/")
      }
      getdata()
    },[])
   
    const handleChange = (e) => {
      setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
      const files=e.target.files[0]
      if(!files) return alert("Upload the image first")
      const type= files.type.split("/")
      if(type[0]!=="image") return alert("Only image is allowed")
      const alltypes=["jpg","jpeg","png","PNG"]
      if(!alltypes.includes(type[1])) return alert("Only jpg,jpeg and png images are allowed")
      setimage(files)
     };
  
    const handleUpload = async(e) => {
      e.preventDefault();
      try {
        setloading(true)
        const auth=JSON.parse(localStorage.getItem("Authorization"))
        if(!auth || !auth.token){
          localStorage.clear();
          alert("Unauthorised user")
          window.history.replaceState(null,null,"/")
          return navigate("/",{replace:true})
        }
        const data=new FormData()
        data.append("itemname",newItem.name)
        data.append("category",newItem.category)
        data.append("price",newItem.price)
        data.append("description",newItem.description)
        data.append("image",image)        
        const response = await Axios.post("addMenus",data,{headers:{
          "Authorization":auth.token
        }})
        alert(response?.data?.message)
        await getAllMenus(auth.token)
        setNewItem({ name: "", price: "", description: "",category:"none" })
        setimage(null)
       } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert('No response from server');
        } else {
          alert('An unexpected error occurred');
        }
       } finally{
        setloading(false)
       }
    };
  
    const handleDelete = (index) => {
      const updatedMenu = menuItems.filter((_, i) => i !== index);
      setMenuItems(updatedMenu);
    };
    return (
      <div>
        <AdminHeader/>
        <div className="container py-5">
        <h2 className="text-center mb-4">Upload Your Menu</h2>
        <div className="col-lg-12">
          <form className="p-4 border rounded mb-4 row">
            <div className="col-lg-8">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" value={newItem.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" name="price" className="form-control" value={newItem.price} onChange={handleChange} required />
              </div>
              {categories.length>0 && <div className="mb-3">
                <label className="form-label">Category</label>
                <select type="text" value={newItem.category} onChange={handleChange} name="category" className="form-control">
                  <option value="none">Select Category</option>
                  {categories?.map((category,index)=><option key={index} value={category.name}>{category.name}</option>)} 
                </select>
              </div>}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" value={newItem.description} onChange={handleChange} required />
              </div>
              <button type="submit" disabled={loading} onClick={handleUpload} className="btn btn-success w-100">{loading?"Uploading...":"Upload Menu Item"}</button>
            </div>
            <div className="col-lg-4 mt-4">
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div style={{height:"230px",width:"85%"}} className="border rounded">
                {image?<img height={"100%"} width={"100%"} src={URL.createObjectURL(image)}></img>:<div style={{height:"100%",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:" rgba(0, 0, 0, 0.1)",boxShadow:" 2px 2px 2px rgba(0, 0, 0, 0.3)"}}><span style={{fontWeight:200}}>Image is not uploaded yet!</span></div>}
                </div>
              </div>
              <div className="text-center">
                <input type="file" ref={imageRef} onChange={handleImage} name="" id="" hidden />
                <button type='button' onClick={()=>imageRef.current.click()} style={{width:"85%"}} className="btn btn-primary mt-2">{image?"Change Image":"Upload Image"}</button>
              </div>
            </div>
          </form>
        </div>
        <h3 className="text-center">Menu List</h3>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Itemname</th>
              <th>Price</th>
              <th>Category</th>
              <th>Description</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length>0?menuItems.map((item, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{item.itemname}</td>
                <td>₹{item.price}/-</td>
                <td>{item.category_name}</td>
                <td>{item.description}</td>
                <td><img style={{height:"100px",width:"130px"}} src={"http://localhost:3010/"+item.image.replace("./uploads","uploads")} alt="" /></td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            )):<tr className='text-center'><td colSpan={6}>No Menu found</td></tr>}
          </tbody>
        </table>
      </div>
      </div>
    );
}
export default Owners