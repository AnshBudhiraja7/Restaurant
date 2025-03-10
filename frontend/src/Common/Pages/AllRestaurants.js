import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom"
import Axios from '../../Axios';
const AllRestaurants = () => {
  const[users,setusers]=useState([])
  const navigate=useNavigate()
  const getAllUsers=async()=>{
    try {
      const response=await Axios.get("getAllUsers")
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
    getAllUsers()
  },[])
  const view = (id) => {
    localStorage.setItem("Selected-Restaurant",JSON.stringify({id}))
    navigate("/Menus")
  }
  return (
    <div>
      <div className="container py-5">
        <h2 className="text-center mb-4">Popular Restaurants</h2>
        <div className="row justify-content-center">
          {users.length>0 && users.map((user, index) => (
            <div key={index} className="col-md-4 mb-4 d-flex justify-content-center">
              <div className="card shadow-lg rounded-lg" style={{ width: '20rem' }}>
                {/* <img src={restaurant.image} className="card-img-top" alt={restaurant.name} /> */}
                <div className="card-body text-center">
                  <h5 className="card-title font-weight-bold">{user.name}</h5>
                  <p className="card-text m-0">{user.phone}</p>
                  <p className="card-text">{user.email}</p>
                  <button className="btn btn-primary" onClick={()=>view(user.id)}>View Menu</button>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </div>
  );
};

export default AllRestaurants;