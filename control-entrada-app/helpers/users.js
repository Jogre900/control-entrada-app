import axios from "axios";
import { API_PORT } from "../config/index";

//virifyLogin
export async function verifyLogin(token){
    const res = await axios.get(`${API_PORT()}/api/verifyLogin`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      return res
}

//SUSPEND EMPLOYEE
export async function suspendEmployee(id){
    const res = await axios.put(`${API_PORT()}/api/user/${id}`)
    return res
}