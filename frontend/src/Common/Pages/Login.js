import React, { useState } from 'react'
import Header from '../Components/Header'
import {useDispatch, useSelector} from "react-redux"
import { useNavigate } from "react-router-dom"
import LoginThunk from '../../Redux/Reducers/LoginReducer/LoginThunk'

const Login = () => {
  const[obj,setobj]=useState({})
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const set=(event)=>setobj({...obj,[event.target.name]:event.target.value})
  const handleSubmit=(e)=>{
    e.preventDefault()
    dispatch(LoginThunk(obj,navigate))
  }
  const auth= useSelector(state=>state.Auth)
  return (
   <div>
    <Header/>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
      <h3 className="text-center mb-4">Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' onChange={set} placeholder="Enter email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={set} placeholder="Enter password" required />
        </div>
        <button type="submit" disabled={auth.loading}  className="btn btn-primary w-100">{auth.loading?"Logging...":"Login"}</button>
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
