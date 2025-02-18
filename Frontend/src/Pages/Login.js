import React, { useState } from 'react'
import Header from './Header'
import {useNavigate} from "react-router-dom"
const Login = () => {
  const[obj,setobj]=useState({})
  const navigate=useNavigate()
  const set=(e)=>{
    setobj({...obj,[e.target.name]:e.target.value})
  }
  const Submit=async(e)=>{
    e.preventDefault()
   const response= await fetch("http://localhost:3010/login",{
      method:"post",
      body:JSON.stringify(obj),
      headers:{
        "Content-Type":"application/json"
      }
    })
    const result=await response.json()
    alert(result.message)
    if(response.status==202){
      navigate("/Menu")
    }
  }
  return (
   <div>
    <Header/>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
      <h3 className="text-center mb-4">Login</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" onChange={set} name='email' className="form-control" id="email" placeholder="Enter email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" onChange={set} name='password' className="form-control" id="password" placeholder="Enter password" required />
        </div>
        <button type="submit" onClick={Submit} className="btn btn-primary w-100">Login</button>
      </form>
      <p className="text-center mt-3">
        <a href="#" className="text-decoration-none">Forgot password?</a>
      </p>
    </div>
  </div>
   </div>
  )
}

export default Login
