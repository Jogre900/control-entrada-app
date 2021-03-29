import axios from "axios";
import { API_PORT } from "../config/index";

//CREATE VISIT
export async function createVisit(visitData, token) {
  console.log(visitData);
  const {
    entryDate,
    descriptionEntry,
    visitUri,
    visitFileName,
    visitFileType,
    userZoneId,
    destinyId,
    citizenId,
  } = visitData;

  let data = new FormData();
  //data.append('name', 'fred')
  if (descriptionEntry) {
    data.append("descriptionEntry", descriptionEntry);
  }
  data.append("entryDate", entryDate.toISOString());
  data.append("file", {
    uri: visitUri,
    name: visitFileName,
    type: visitFileType,
  });
  data.append("userZoneId", userZoneId);
  data.append("destinyId", destinyId);
  data.append("citizenId", citizenId);
  //console.log(token)
  //console.log(data);
  try {
    const res = await axios({
      method: "POST",
      url: `${API_PORT()}/api/visit`,
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
    //console.log(res);
    return res;
  } catch (error) {
    console.log(error.message);
  }
}

//FIND VISIT BY DNI
export async function findVisitdni(dni) {
  try {
    const res = await axios.get(`${API_PORT()}/api/visit/${dni}`);
    return res;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}
//TODAY VISITS BY USERZONE, ONE EMPLOYEE
export async function findVisitUser(userzoneId, token) {
  try {
    const res = await axios.get(`${API_PORT()}/api/visits/${userzoneId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error.message);
  }
}
//FIND VISIT BY ID
export async function fetchVisitId(id){
  const res = await axios.get(`${API_PORT()}/api/visitId/${id}`)
  return res
}
//TODAY VISITS FROM ALL EMPLOYEE
export async function fetchTodayVisist(employee) {
  console.log("uzid helper----", employee);
  try {
    let res = await axios({
      method: "POST",
      url: `${API_PORT()}/api/visits`,
      data: { id: employee },
    });
    // `${API_PORT()}/api/findTodayVisits/${companyId}`, {data: employee});
    //console.log(res.data);

    return res;
  } catch (error) {
    return error.message;
  }
}

//FIND ALL VISISTS BY DESTINY ID
export async function fetchVisitDestiny(id, token){
  const res = await axios.get(`${API_PORT()}/api/visitsdestiny/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res
}

//CREATE DEPARTURE
export async function createDeparture(id, data, token) {
    const res = await axios.post(`${API_PORT()}/api/departure/${id}`, data, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return res;
}
//USER WITH MAX VISIT REGISTER
export async function maxUserVisit(companyId){
  const res = await axios.get(`${API_PORT()}/api/userCompany/${companyId}`)
  if(res){
    return res
  }
}
