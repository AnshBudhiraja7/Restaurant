import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import FoodItem from '../Components/FoodItem';
import Header from '../Components/Header';
import Axios from '../../Axios';
const Menus = () => {
  const navigate=useNavigate()
  const [menus, setmenus] = useState([])
  const [order, setorder] = useState([])
  const getAllMenus = async(id) => {
    try {
      const response=await Axios.get("getAllMenus/"+id)
      setmenus(response?.data?.data)
    } catch (error) {
      setmenus([])
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
    const getData = async() => {
      const selected_restaurant=JSON.parse(localStorage.getItem("Selected-Restaurant"))
      if(selected_restaurant && selected_restaurant.id) return await getAllMenus(selected_restaurant.id) 
      localStorage.clear()
      navigate("/")
    }
    getData()
  },[])

  useEffect(() => {
    const Selected_Restaurant= JSON.parse(localStorage.getItem("Selected-Restaurant"))
    if(!Selected_Restaurant || !Selected_Restaurant.id){
      localStorage.clear()
      return navigate("/")
    }
    Selected_Restaurant.order=order
    localStorage.setItem("Selected-Restaurant",JSON.stringify(Selected_Restaurant))
   },[order])
  return (
    <div>
      <Header/>
      <div className="container py-5">
      <h2 className="text-center mb-4">Our Menu</h2>
      <div className="row justify-content-center">
        {menus.length>0 && menus.map((item, index) => (
          <div key={index} className="col-md-4 d-flex justify-content-center">
            <FoodItem {...item} order={order} setorder={setorder} />
          </div>))}
      </div>
    </div>
    </div>
  )
}

export default Menus
