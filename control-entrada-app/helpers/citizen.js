import axios from "axios";
import { API_PORT } from "../config/index";

//FIND CITIZEN
export async function findCitizendni(dni, token) {
  try {
    const res = await axios.get(`${API_PORT()}/api/citizen/${dni}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error.message);
  }
}

//CREATE CITIZEN
export async function createCitizen(citizenData, token) {
  console.log(citizenData, token);
  const {
    name,
    lastName,
    dni,
    profileUri,
    profileFileName,
    profileFileType,
    entryDate,
    descriptionEntry,
    visitUri,
    visitFileName,
    visitFileType,
    userZoneId,
    destinyId,
  } = citizenData;

  let data = new FormData();

  data.append("name", name);
  data.append("lastName", lastName);
  data.append("dni", dni);
  data.append("file", {
    uri: profileUri,
    name: profileFileName,
    type: profileFileType,
  });
  data.append("descriptionEntry", descriptionEntry);
  data.append("entryDate", entryDate.toISOString());
  data.append("file", {
    uri: visitUri,
    name: visitFileName,
    type: visitFileType,
  });
  data.append("userZoneId", userZoneId);
  data.append("destinyId", destinyId);
  console.log(data)
  try {
   const res = await axios.post(`${API_PORT()}/api/citizen`, data, {
     headers: {
           Authorization: `Bearer ${token}`,   
           "content-type": 'multipart/form-data'
     }
   })
    // const res = await axios({
    //   method: "POST",
    //   url: `${API_PORT()}/api/citizen`,
    //   data: data,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
        
        
    //   },
  
    
    // .post(`${API_PORT()}/api/citizen`, data, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    console.log("RES FROM HELPER---", res.data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
}
