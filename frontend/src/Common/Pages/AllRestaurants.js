import React from 'react';

const AllRestaurants = () => {
    const restaurants = [
        {
          name: "The Gourmet Spot",
          description: "A fine dining experience with exquisite dishes and ambiance.",
          image: "https://via.placeholder.com/300",
        },
        {
          name: "Urban Bites",
          description: "Delicious street food with a modern twist, served fresh every day.",
          image: "https://via.placeholder.com/300",
        },
        {
          name: "Seafood Delight",
          description: "Freshly caught seafood cooked to perfection with authentic flavors.",
          image: "https://via.placeholder.com/300",
        },
        {
          name: "Veggie Haven",
          description: "A paradise for vegetarians offering organic and farm-fresh meals.",
          image: "https://via.placeholder.com/300",
        },
    ];
  return (
    <div>
      <div className="container py-5">
        <h2 className="text-center mb-4">Popular Restaurants</h2>
        <div className="row justify-content-center">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="col-md-4 mb-4 d-flex justify-content-center">
              <div className="card shadow-lg rounded-lg" style={{ width: '20rem' }}>
                <img src={restaurant.image} className="card-img-top" alt={restaurant.name} />
                <div className="card-body text-center">
                  <h5 className="card-title font-weight-bold">{restaurant.name}</h5>
                  <p className="card-text">{restaurant.description}</p>
                  <button className="btn btn-primary">View Menu</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRestaurants;