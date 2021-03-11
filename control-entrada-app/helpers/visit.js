import axios from "axios";
import { API_PORT } from "../config/index";

//CREATE VISIT
export async function createVisit(visitData, token) {
    console.log(visitData);
    const {
      entryDate,
      departureDate,
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
    data.append("descriptionEntry", descriptionEntry);
    data.append("entryDate", entryDate.toISOString());
    data.append("departureDate", departureDate.toISOString());
    data.append("file", {
      uri: visitUri,
      name: visitFileName,
      type: visitFileType,
    });
    data.append("userZoneId", userZoneId);
    data.append("destinyId", destinyId);
    data.append("citizenId", citizenId);
    //console.log(token)
    console.log(data);
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
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
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
  //TODAY VISITS
  export async function fetchTodayVisist(companyId, employee) {
    console.log("uzid helper----", employee);
    try {
      let res = await axios({
        method: "POST",
        url: `${API_PORT()}/api/visits`,
        data: { id: employee },
      });
      // `${API_PORT()}/api/findTodayVisits/${companyId}`, {data: employee});
      console.log(res.data);
  
      return res;
    } catch (error) {
      return error.message;
    }
  }