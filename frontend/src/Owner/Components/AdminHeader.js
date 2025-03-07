import React from 'react'
import {Link} from "react-router-dom"
const AdminHeader = () => {
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
          <Link className="nav-link" to="/Orders">Orders</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">Log out</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</div>
  )
}

export default AdminHeader
