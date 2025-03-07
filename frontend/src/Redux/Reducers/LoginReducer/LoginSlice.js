import { createSlice } from "@reduxjs/toolkit";

const LoginSlice=createSlice({
    name:"Auth",
    initialState:{
        user:null,
        loading:false,
        error:null
    },
    reducers:{
        setuser:(state,action)=>{
            state.user=action.payload
        },
        setloading:(state,action)=>{
            state.loading=action.payload
        },
        seterror:(state,action)=>{
            state.error=action.payload
        }
    }
})
export const {setuser,setloading,seterror}=LoginSlice.actions
export default LoginSlice.reducer