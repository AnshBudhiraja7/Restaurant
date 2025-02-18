// import React from 'react'
// import Api from './Api'
// import "./style.css"

// var App = () => {
//     console.log(Api)
//     var allCat = Api.map(function (obj) {
//         return obj.category
//     })
//     console.log(allCat)
//     return (
//         <div>

//             <div id="row">
//                 {
//                     allCat.map(function (name) {
//                         return (
//                             <>
//                                 <button>{name}</button>
//                             </>
//                         )
//                     })
//                 }
//                 {/* <button>FastFood</button>
//              <button>Bevrages</button>
//              <button>Dinner</button> */}
//             </div>
//             {

//                 Api.map(function (obj) {
//                     return (
//                         <>
//                             <div id="box">
//                                 <img src={obj.url} alt="" />
//                                 <span>{obj.Name}</span>
//                                 <span>INR. {obj.Location}</span>
//                             </div>
//                         </>
//                     )
//                 })
//             }
//         </div>
//     )
// }

// export default App


import React from 'react'
import FoodItem from './FoodItem';
import Header from './Header';

const UserPage = () => {
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

export default UserPage
