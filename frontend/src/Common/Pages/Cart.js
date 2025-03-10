import React, { useEffect, useState } from 'react'
import OrderForm from '../Components/OrderForm';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const Selected_Restaurant= JSON.parse(localStorage.getItem("Selected-Restaurant"))
    if(!Selected_Restaurant || !Selected_Restaurant.id){
      localStorage.clear()
      return navigate("/")
    }
    if(Selected_Restaurant.order) setCartItems(Selected_Restaurant.order)
  },[])

  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].qty += 1;
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].qty > 1) {
      updatedCart[index].qty -= 1;
      setCartItems(updatedCart);
    }
    else setCartItems(updatedCart.filter((item,i)=>i!==index))
  };

  useEffect(()=>{
      const Selected_Restaurant= JSON.parse(localStorage.getItem("Selected-Restaurant"))
      if(!Selected_Restaurant || !Selected_Restaurant.id){
        localStorage.clear()
        return navigate("/")
      }
      Selected_Restaurant.order=cartItems
      localStorage.setItem("Selected-Restaurant",JSON.stringify(Selected_Restaurant))
  },[cartItems])

  return (
    <div>
      <Header/>
      <div className="container py-5">
      <h2 className="text-center mb-4">Your Cart</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length>0 ? cartItems?.map((item, index) => (
            <tr key={index}>
              <td>{item.product_name}</td>
              <td>₹{item.price.toFixed(2)}/-</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => decreaseQuantity(index)}>-</button>
                <span className="mx-2">{item.qty}</span>
                <button className="btn btn-sm btn-success" onClick={() => increaseQuantity(index)}>+</button>
              </td>
              <td>₹{(item.price * item.qty).toFixed(2)}/-</td>
            </tr>
          )):<tr className='text-center'><td colSpan={4}>No Menu Found</td></tr>}
        </tbody>
      </table>
      <button disabled={cartItems.length===0?true:false} className="btn btn-success w-100" onClick={handleOrderNow}>Order Now</button>
      {showOrderForm && <OrderForm />}
    </div>
    </div>
  );
}
export default Cart