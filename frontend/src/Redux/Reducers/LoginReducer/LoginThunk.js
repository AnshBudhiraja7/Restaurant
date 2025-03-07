import {setuser,setloading,seterror} from "./LoginSlice"
import Axios from "../../../Axios"

const LoginThunk=(object,navigate)=>async(dispatch)=>{
try {
    dispatch(setloading(true))
    dispatch(seterror(null))
    const response=await Axios.post("login",object)
    alert(response?.data?.message)
    dispatch(setuser(response?.data?.data)) 
    localStorage.setItem("Authorization",JSON.stringify({token:response?.data?.data?.token}))
    navigate(`/${response?.data?.data?.role}`)
} catch (error) {
    alert(error?.response?.data?.message || 'An unexpected error occurred')
    dispatch(seterror(error?.response?.data?.message || 'An unexpected error occurred'))
} finally{
    dispatch(setloading(false))
}
}
export default LoginThunk