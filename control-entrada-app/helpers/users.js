import axios from "axios";
import { API_PORT } from "../config/index";

//SUSPEND EMPLOYEE
export async function suspendEmployee(id){
    const res = await axios.put(`${API_PORT()}/api/user/${id}`)
    return res
}