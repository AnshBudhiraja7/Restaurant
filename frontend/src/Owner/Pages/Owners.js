import React, { useEffect, useRef, useState } from 'react'
import AdminHeader from '../Components/AdminHeader';
import { useNavigate } from 'react-router-dom';
import Axios from '../../Axios';

const Owners = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [editItems, seteditItems] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editimageid, seteditimageid] = useState(null)
    const [updatedimage, setupdatedimage] = useState(null)
    const imageRef = useRef()
    const newimageRef = useRef()
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
        setMenuItems([])
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

     const handleNewImage=(e)=>{
      const files=e.target.files[0]
      if(!files) return alert("Upload the image first")
      const type= files.type.split("/")
      if(type[0]!=="image") return alert("Only image is allowed")
      const alltypes=["jpg","jpeg","png","PNG"]
      if(!alltypes.includes(type[1])) return alert("Only jpg,jpeg and png images are allowed")
      setupdatedimage(files)
     }
  
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
  
    const handleDelete =async (id) => {
      try {
        const auth=JSON.parse(localStorage.getItem("Authorization"))
        if(!auth || !auth.token){
          localStorage.clear();
          alert("Unauthorised user")
          window.history.replaceState(null,null,"/")
          return navigate("/",{replace:true})
        }
        const response = await Axios.delete("deleteItem/"+id,{headers:{
          "Authorization":auth.token
        }})
        alert(response?.data?.message)
        await getAllMenus(auth.token)
      }  catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert('No response from server');
        } else {
          alert('An unexpected error occurred');
        }
       }
    };

    const handleUpdateImage = async () => {
      try {
        const auth=JSON.parse(localStorage.getItem("Authorization"))
        if(!auth || !auth.token){
          localStorage.clear();
          alert("Unauthorised user")
          window.history.replaceState(null,null,"/")
          return navigate("/",{replace:true})
        }
        const data=new FormData()
        data.append("image",updatedimage)
        const response = await Axios.put("updateItemImage/"+editimageid,data,{headers:{
          "Authorization":auth.token
        }})
        alert(response?.data?.message)
        seteditimageid(null)
        setupdatedimage(null)
        await getAllMenus(auth.token)
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
    
    const handleUpdate = async () => {
      try {
        const auth=JSON.parse(localStorage.getItem("Authorization"))
        if(!auth || !auth.token){
          localStorage.clear();
          alert("Unauthorised user")
          window.history.replaceState(null,null,"/")
          return navigate("/",{replace:true})
        }
        const response = await Axios.put("updateItem/"+editItems.id,editItems,{headers:{
          "Authorization":auth.token
        }})
        alert(response?.data?.message)
        await getAllMenus(auth.token)
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert('No response from server');
        } else {
          alert('An unexpected error occurred');
        }
      } finally {
        seteditItems(null)
        setShowModal(false)
      }
    }
    return (
      <div>
        <AdminHeader/>
        <div className="container py-5">
        <h2 className="text-center mb-4">Upload Your Menu</h2>
        <div className="col-lg-12">
          <form className="p-4 border rounded mb-4 row">
            <div className="col-lg-8">
              <div className="mb-3">
                <label className="form-label">Itemname</label>
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
              <th style={{width:"35%"}}>Image</th>
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
                <td style={{display:"flex",justifyContent:"space-evenly"}}>
                  <div>{editimageid===item.id && updatedimage?<img style={{height:"100px",width:"130px"}} src={URL.createObjectURL(updatedimage)} alt="" />:<img style={{height:"100px",width:"130px"}} src={"http://localhost:3010/"+item.image.replace("./uploads","uploads")} alt="" />}</div>
                  <div>{editimageid===item.id && updatedimage?<div><button className='btn btn-success btn-sm' onClick={handleUpdateImage}>Upload & Save</button><button className='btn btn-danger btn-sm ms-2' onClick={()=>{seteditimageid(null);setupdatedimage(null)}}>Cancel</button></div>:<button className='btn btn-primary btn-sm' onClick={()=>{seteditimageid(item.id);newimageRef.current.click()}}>Change Image</button>}</div>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                  <button className='btn btn-primary btn-sm ms-2' onClick={()=>{seteditItems({...item,"category":item.category_name});setShowModal(true)}}>Edit</button>
                </td>
              </tr>
            )):<tr className='text-center'><td colSpan={7}>No Menu found</td></tr>}
          </tbody>
        </table>
        <input type="file" onChange={handleNewImage} ref={newimageRef} hidden />
      </div>


      {showModal && editItems && (<div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit your item</h5>
                <button type="button" className="btn-close" onClick={() =>{setShowModal(false);seteditItems(null)}}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label>Itemname</label>
                    <input type="text" onChange={(e)=>seteditItems({...editItems,[e.target.name]:e.target.value})} value={editItems.itemname} name='itemname' className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>Price</label>
                    <input type="number" onChange={(e)=>seteditItems({...editItems,[e.target.name]:e.target.value})} value={editItems.price} name='price' className="form-control" />
                  </div>
                  {categories.length>0 && <div className="mb-3">
                    <label>Category</label>
                    <select name="category" onChange={(e)=>seteditItems({...editItems,[e.target.name]:e.target.value})} value={editItems.category} className='form-control'>
                      <option value="none">Select Category</option>
                      {categories.map((category,index)=><option key={index} value={category.name}>{category.name}</option>)}
                    </select>
                  </div>}
                  <div className="mb-3">
                    <label>Description</label>
                    <input type="text" onChange={(e)=>seteditItems({...editItems,[e.target.name]:e.target.value})} name='description' value={editItems.description} className="form-control" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className='btn btn-success' disabled={loading} onClick={handleUpdate}>{loading?"Updating...":"Update"}</button>
                <button className="btn btn-secondary" onClick={() =>{setShowModal(false);seteditItems(null)}}>Close</button>
              </div>
            </div>
          </div>
      </div>)}
      {showModal && <div className="modal-backdrop fade show"></div>}
      </div>
    );
}
export default Owners