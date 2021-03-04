import { useState } from "react";
import axios from "axios";
import { API_PORT } from "../config/index";
import { LoadingModal } from "../components/loadingModal";
let check = false;
let msg = "";
let item = null;

//DELETE ANYTHING FROM API
export async function deleteInfo(url, arrayIds) {
  try {
    const res = await axios({
      method: "DELETE",
      url: url,
      data: { id: arrayIds },
    });
    return res.data
  } catch (error) {
    
    return error.message;
  }
}
//SAVE INFO TO API
export async function createInfo(url, params, data) {
  console.log(url, params, data)
  try {
    const res = await axios.post(`${API_PORT()}/api/${url}/${params}`, data);
    return res.data ;
  } catch (error) {
    return error.message;
  }
}
//ZONES BY ID
export async function fetchZonyById(id) {
  try {
    const res = await axios.get(`${API_PORT()}/api/findZone/${id}`);
    if (!res.data.error) {
      return res.data.data;
    }
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

//ALL DESTINYS FROM COMPANY
export async function fetchDestiny(companyId) {
  try {
    const res = await axios.get(
      `${API_PORT()}/api/findAllDestiny/${companyId}`
    );
    if (!res.data.error) {
      return res.data.data;
    }
  } catch (error) {
    return error.message;
  }
}

//TODAY VISITS
export async function fetchTodayVisist(companyId) {
  try {
    let res = await axios.get(`${API_PORT()}/api/findTodayVisits/${companyId}`);
    if (!res.data.error) {
      return res.data.data;
    }
  } catch (error) {
    return error.message;
  }
}

//ALL EMPLOYEES BY COMPANY
export async function fetchAllEmployee(companyId) {
  try {
    const res = await axios.get(`${API_PORT()}/api/findUsers/${companyId}`);
    if (!res.data.error) {
      return res.data.data;
    }
  } catch (error) {
    return error.message;
  }
}

//ALL EMPLOYEE FROM 1 ZONE
export async function fetchEmployeeByZone(zoneId) {
  try {
    const res = await axios.get(`${API_PORT()}/api/findUsersByZone/${zoneId}`);
    if (!res.data.error) {
      return res.data.data;
    }
  } catch (error) {
    return error.message;
  }
}
