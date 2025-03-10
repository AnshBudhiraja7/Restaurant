import React, { useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom"
const AdminHeader = () => {
  const navigate=useNavigate()
  useEffect(()=>{
      const auth=JSON.parse(localStorage.getItem("Authorization"))
      if(!auth || !auth.token) return navigate("/")
  },[])
  const logout=()=>{
      localStorage.clear()
      window.history.replaceState(null,null,"/")
      return navigate("/",{replace:true})
  }
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container">
    <a className="navbar-brand" href="#">FoodApp</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/owner">Menu</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/Category">Category</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/Orders">Orders</Link>
        </li>
        <li className="nav-item">
          <a style={{cursor:"pointer"}} onClick={logout} className="nav-link" >Log out</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</div>
  )
}

export default AdminHeader
