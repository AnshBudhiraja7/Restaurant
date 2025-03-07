import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom"
import AddUser from '../Components/AddUser';
import Users from '../Components/Users';
import Axios from '../../Axios';

const Superadmin = () => {
  const[users,setusers]=useState([])
  const navigate=useNavigate()
  const getAllUsers=async(token)=>{
    try {
      const response=await Axios.get("getAllUsers",{
      headers:{
        "Authorization":token
      }})
      setusers(response?.data?.data)
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
    if(auth && auth.token) return await getAllUsers(auth.token)
    localStorage.clear()
    return navigate("/")
    }
    getdata()
  },[])
  return (
    <div>
      <Users users={users}/>
      <AddUser fun={getAllUsers}/>
    </div>
  );
};

export default Superadmin;