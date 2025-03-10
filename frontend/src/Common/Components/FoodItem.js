import React from 'react'
const FoodItem = ({ itemname, price, description, image,order,setorder }) => {
    return (
        <div className="card m-3 shadow" style={{ width: "18rem", borderRadius: "10px" }}>
        <img src={"http://localhost:3010"+image.replace("./uploads","/uploads")} className="card-img-top" alt={itemname} style={{ height: "200px", objectFit: "cover" }} />
        <div className="card-body">
          <h5 className="card-title">{itemname}</h5>
          <p className="card-text text-muted">{description}</p>
          <h6 className="text-primary">₹{price}/-</h6>
          <button disabled={order.map(item=>item.product_name).includes(itemname)?true:false} className="btn btn-success w-100 mt-2" onClick={()=>setorder([...order,{product_name:itemname,price,qty:1}])}>{order.map(item=>item.product_name).includes(itemname)?"Added":"Add to Cart"}</button>
        </div>
      </div>
    );
  };

export default FoodItem
