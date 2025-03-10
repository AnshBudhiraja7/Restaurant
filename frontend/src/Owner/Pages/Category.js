import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import Axios from '../../Axios'
import AdminHeader from '../Components/AdminHeader'
const Category = () => {
    const [obj,setobj] = useState({name:""})
    const [loading, setloading] = useState(false)
    const [categories, setcategories] = useState([])
    const navigate = useNavigate()
    const getAllCategories=async(token)=>{
        try {
          const response=await Axios.get("getAllCategories",{
          headers:{
            "Authorization":token
          }})
          setcategories(response?.data?.data)
        } catch (error) {
            setcategories([])
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
          if(auth && auth.token) return await getAllCategories(auth.token)
          localStorage.clear()
          return navigate("/")
        }
        getdata()
      },[])
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
          const response = await Axios.post("createCategory",obj,{headers:{
            "Authorization":auth.token
          }})
          alert(response?.data?.message)
          await getAllCategories(auth.token)
         } catch (error) {
          if (error.response) {
            alert(error.response.data.message);
          } else if (error.request) {
            alert('No response from server');
          } else {
            alert('An unexpected error occurred');
          }
         } finally{
          setobj({name:""})
          setloading(false)
         }
    }
  return (
    <div>
        <AdminHeader/>
        <div className="container vh-100">
        <div className="container py-5">
        <h2 className="text-center mb-4">Upload Your Category</h2>
        <div className="col-lg-12">
          <form onSubmit={handleUpload} className="p-4 border rounded mb-4 row">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input type="text" name="name" value={obj.name} onChange={(e)=>setobj({...obj,[e.target.name]:e.target.value})} className="form-control" required />
              </div>
              <div className="text-center"><button disabled={loading} style={{width:"100%"}} className='btn btn-success btn-sm'>{loading?"Saving...":"Save"}</button></div>
          </form>
        </div>
        </div>    
        <div className="row">
        {categories.length>0 && categories.map((category,index)=>{
            return(<div key={index} className="card ms-4 shadow-lg p-4 text-center" style={{ width: "400px", borderRadius: "15px" }}>
        <h2 className="mb-3">Category Details</h2>
        <div className="row">
        <div className="col-6">
            <div className="p-3 border rounded bg-light">
              <h4 className="text-success">#{category.id}</h4>
              <p className="mb-0">Category ID</p>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3 border rounded bg-light">
              <h4 className="text-primary">{category.name}</h4>
              <p className="mb-0">Category Name</p>
            </div>
          </div>
        </div>
      </div>)})}
        </div>
        </div>
    </div>
  )
}

export default Category
