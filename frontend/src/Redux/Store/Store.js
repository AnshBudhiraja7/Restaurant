import {configureStore} from "@reduxjs/toolkit"
import LoginSlice from "../Reducers/LoginReducer/LoginSlice"
import AllUsersSlice from "../Reducers/AllUsers/AllUsersSlice"
export default configureStore({
    reducer:{
        Auth:LoginSlice,
        AllUsers:AllUsersSlice
    }
})