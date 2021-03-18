import axios from "axios";
import { API_PORT } from "../config/index";

//ZONES BY ID
export async function fetchZoneById(id) {
    try {
      const res = await axios.get(`${API_PORT()}/api/zone/${id}`);
     return res
    } catch (error) {
      return error.message;
    }
  }
  
  //ZONES FROM COMPANY
  export async function fetchAllZones(companyId) {
    try {
      const res = await axios.get(`${API_PORT()}/api/findZones/${companyId}`);
      if (!res.data.error) {
        return res.data.data;
      }
    } catch (error) {
      return error.message;
    }
  }