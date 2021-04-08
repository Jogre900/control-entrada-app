import axios from "axios";
import { API_PORT } from "../config/index";
import { storage } from "./asyncStorage";

//CREATE ZONE
export async function createZone(data){
  const token = await storage.getItem("userToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${API_PORT()}/api/zone`, data, config)
  return res
}
//DELETE ZONE
export async function deleteZone(zoneId){
  const token = await storage.getItem("userToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(`${API_PORT()}/api/zone/${zoneId}`, config)
  return res
}
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
    const res = await axios({
      method: 'POST',
      url: `${API_PORT()}/api/destinyMaxVisit`,
      data: zoneId
    })
    
    
    //get(`${API_PORT()}/api/destinyMaxVisit` , zoneId)
    if(res){
      return res
    }
  }