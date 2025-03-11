import Axios from "../../../Axios";
import { setusers,setloading,seterror } from "./AllUsersSlice"
const AllUsersThunk=()=>async(dispatch)=>{
    try {
      dispatch(setloading(true))
      dispatch(seterror(null))

      const response=await Axios.get("getAllUsers")
      dispatch(setusers(response?.data?.data))

    } catch (error) {
      dispatch(seterror(error))
      
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.request) {
        alert('No response from server');
      } else {
        alert('An unexpected error occurred');
      }
    } finally{
        dispatch(setloading(false))
    }
}
export default AllUsersThunk