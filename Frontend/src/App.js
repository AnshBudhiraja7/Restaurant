import React from 'react'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import UserPage from './Pages/UserPage'
import Login from './Pages/Login'
import MenuPage from './AdminPage/MenuPage'
import OrderPage from './AdminPage/OrderPage'
import Cart from './Pages/Cart'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<UserPage/>}></Route>
            <Route path='/Cart' element={<Cart/>}></Route>
            <Route path='/Login' element={<Login/>}></Route>
            <Route path='/Menu' element={<MenuPage/>}></Route>
            <Route path='/Orders' element={<OrderPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
