import React from "react";
const OrderForm = () => {
    return (
      <div className="container mt-4">
        <h3 className="text-center">Enter Your Details</h3>
        <form className="p-4 border rounded">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Submit Order</button>
        </form>
      </div>
    );
  };
export default OrderForm