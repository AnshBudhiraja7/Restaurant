import {createSlice} from "@reduxjs/toolkit"

const AllUsersSlice=createSlice({
    name:"AllUsers",
    initialState:{
        users:null,
        loading:false,
        error:null
    },
    reducers:{
        setusers:(state,action)=>{
            state.users=action.payload
        },
        setloading:(state,action)=>{
            state.loading=action.payload
        },
        seterror:(state,action)=>{
            state.error=action.payload
        }
    }
})
export const {setusers,setloading,seterror} =AllUsersSlice.actions
export default AllUsersSlice.reducer