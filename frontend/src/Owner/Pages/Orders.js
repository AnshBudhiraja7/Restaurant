import React, { useState } from 'react'
import AdminHeader from '../Components/AdminHeader';

const Orders = () => {
    const [orders, setOrders] = useState([
        { id: 1, customer: "John Doe", items: ["Burger", "Fries"], status: "Pending" },
        { id: 2, customer: "Jane Smith", items: ["Pizza"], status: "Accepted" },
      ]);
    
      const updateStatus = (index, newStatus) => {
        const updatedOrders = [...orders];
        updatedOrders[index].status = newStatus;
        setOrders(updatedOrders);
      };
    
      return (
        <div>
            <AdminHeader/>
            <div className="container py-5">
          <h2 className="text-center mb-4">Orders</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.items.join(", ")}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status === "Pending" && (
                      <button className="btn btn-warning btn-sm me-2" onClick={() => updateStatus(index, "Accepted")}>
                        Accept
                      </button>
                    )}
                    {order.status === "Accepted" && (
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(index, "Completed")}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      );
}

export default Orders
