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
//ZONE WITH MAX NUMBER OF VISITS
  export async function zoneMaxVisit(companyId){
    const res = await axios.get(`${API_PORT()}/api/zoneMaxVisit/${companyId}`)
    if(res){
      return res
    }
  }

  //DESTINY WITH MAX NUMBER OF VISITS
  export async function destinyMaxVisit(zoneId){
    console.log(zoneId)
    const res = await axios.get(`${API_PORT()}/api/destinyMaxVisit/${zoneId}`)
    if(res){
      return res
    }
  }