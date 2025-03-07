import {configureStore} from "@reduxjs/toolkit"
import LoginSlice from "../Reducers/LoginReducer/LoginSlice"
export default configureStore({
    reducer:{
        Auth:LoginSlice
    }
})