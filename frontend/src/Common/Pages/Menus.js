import React from 'react'
import FoodItem from '../Components/FoodItem';
import Header from '../Components/Header';

const Menus = () => {
    const foodItems = [
        {
          name: "Burger",
          price: "5.99",
          description: "Juicy grilled beef patty with fresh lettuce, tomato, and cheese.",
          image: "https://via.placeholder.com/200"
        },
        {
          name: "Pizza",
          price: "8.99",
          description: "Delicious cheese pizza with a crispy crust and fresh toppings.",
          image: "https://via.placeholder.com/200"
        },
        {
          name: "Pasta",
          price: "7.49",
          description: "Creamy Alfredo pasta with grilled chicken and parmesan.",
          image: "https://via.placeholder.com/200"
        }
      ];
  return (
    <div>
      <Header/>
      <div className="container py-5">
      <h2 className="text-center mb-4">Our Menu</h2>
      <div className="row justify-content-center">
        {foodItems.map((item, index) => (
          <div key={index} className="col-md-4 d-flex justify-content-center">
            <FoodItem {...item} />
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Menus
