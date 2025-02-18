import React, { useState } from 'react'
import AdminHeader from './AdminHeader';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "", description: "" });
  
    const handleChange = (e) => {
      setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };
  
    const handleUpload = (e) => {
      e.preventDefault();
      if (newItem.name && newItem.price && newItem.description) {
        setMenuItems([...menuItems, newItem]);
        setNewItem({ name: "", price: "", description: "" });
      }
    };
  
    const handleDelete = (index) => {
      const updatedMenu = menuItems.filter((_, i) => i !== index);
      setMenuItems(updatedMenu);
    };
  
    return (
      <div>
        <AdminHeader/>
        <div className="container py-5">
        <h2 className="text-center mb-4">Upload Your Menu</h2>
        <form className="p-4 border rounded mb-4">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" value={newItem.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" name="price" className="form-control" value={newItem.price} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" value={newItem.description} onChange={handleChange} required />
          </div>
          <button type="submit" onClick={handleUpload} className="btn btn-success w-100">Upload Menu Item</button>
        </form>
        <h3 className="text-center">Menu List</h3>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.description}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
}

export default MenuPage
