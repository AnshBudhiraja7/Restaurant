import React, { useState } from 'react'
import OrderForm from '../Components/OrderForm';
import Header from '../Components/Header';

const Cart = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [cartItems, setCartItems] = useState([
    { name: "Burger", price: 5.99, quantity: 2 },
    { name: "Pizza", price: 8.99, quantity: 1 },
    { name: "Pasta", price: 7.49, quantity: 3 }
  ]);

  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCartItems(updatedCart);
    }
  };

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
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => decreaseQuantity(index)}>-</button>
                <span className="mx-2">{item.quantity}</span>
                <button className="btn btn-sm btn-success" onClick={() => increaseQuantity(index)}>+</button>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-success w-100" onClick={handleOrderNow}>Order Now</button>
      {showOrderForm && <OrderForm />}
    </div>
    </div>
  );
}
export default Cart