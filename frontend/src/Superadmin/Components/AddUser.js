import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import Axios from '../../Axios';
const AddUser = ({fun}) => {
  const [newUser, setNewUser] = useState({ name: '', email: '',phone:'',password:'',otp:'' });
  const [loading,setloading] = useState(false)
  const [btnloading,setbtnloading]=useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const handleSubmit = async() => {
   try {
    setbtnloading(true)
    const auth=JSON.parse(localStorage.getItem("Authorization"))
    if(!auth || !auth.token){
      localStorage.clear();
      alert("Unauthorised user")
      window.history.replaceState(null,null,"/")
      return navigate("/",{replace:true})
    }
    const response = await Axios.post("verifyUser",newUser,{headers:{
      "Authorization":auth.token
    }})
    alert(response?.data?.message)
    setloading(true)
   } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else if (error.request) {
      alert('No response from server');
    } else {
      alert('An unexpected error occurred');
    }
   } finally{
    setbtnloading(false)
   }
  };
  const Submit = async() => {
    try {
     const auth=JSON.parse(localStorage.getItem("Authorization"))
     if(!auth || !auth.token){
       localStorage.clear();
       alert("Unauthorised user")
       window.history.replaceState(null,null,"/")
       return navigate("/",{replace:true})
     }
     const response = await Axios.post("createUser",newUser,{headers:{
       "Authorization":auth.token
     }})
     alert(response?.data?.message)
     setNewUser({ name: '', email: '',phone:'',password:'',otp:'' })
     setloading(false)
     await fun(auth.token)
    } catch (error) {
     if (error.response) {
       alert(error.response.data.message);
     } else if (error.request) {
       alert('No response from server');
     } else {
       alert('An unexpected error occurred');
     }
    }
  };
  return (
    <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addUserModalLabel">Add New User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {loading?<div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Otp</label>
                  <input type="number" className="form-control" name="otp" value={newUser.otp} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={Submit} data-bs-dismiss="modal">Add User</button>
              </div>
              </div>:<div>
                <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" value={newUser.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={newUser.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" name="phone" value={newUser.phone} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" value={newUser.password} onChange={handleChange} />
              </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" disabled={btnloading} className="btn btn-primary" onClick={handleSubmit}>{btnloading?"Sending otp...":"Send otp"}</button>
              </div>
              </div>}
          </div>
        </div>
      </div>
  )
}

export default AddUser
