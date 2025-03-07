import React from 'react'

const FoodItem = ({ name, price, description, image }) => {
    return (
        <div className="card m-3 shadow" style={{ width: "18rem", borderRadius: "10px" }}>
        <img src={image} className="card-img-top" alt={name} style={{ height: "200px", objectFit: "cover" }} />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text text-muted">{description}</p>
          <h6 className="text-primary">₹{price}/-</h6>
          <button className="btn btn-success w-100 mt-2">Add to Cart</button>
        </div>
      </div>
    );
  };

export default FoodItem
