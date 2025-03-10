import React from 'react'

const Users = ({users}) => {
  return (
    <div className="container py-5">
        <h2 className="text-center mb-4">User Management</h2>
        <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addUserModal">Add User</button>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            { users.length>0?users?.map((user,index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAT).toLocaleString("en-GB", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</td>
              </tr>
            )):<tr><td className='text-center' colSpan={6}>No Users found</td></tr>}
          </tbody>
        </table>
      </div>
  )
}

export default Users
