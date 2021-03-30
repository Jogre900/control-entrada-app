import { useState } from "react";
import axios from "axios";
import { API_PORT } from "../config/index";
import { createCitizen, findCitizendni } from "./citizen";
import { fetchAllZones,fetchZoneById, zoneMaxVisit, destinyMaxVisit } from './zones'
import { suspendEmployee, verifyLogin, updateProfile } from './users'
import {
  createVisit,
  findVisitdni,
  findVisitUser,
  fetchVisitId,
  createDeparture,
  fetchTodayVisist,
  maxUserVisit,
  fetchVisitDestiny
} from "./visit";

export const helpers = {
  createCitizen,
  findCitizendni,
  createVisit,
  fetchTodayVisist,
  findVisitdni,
  fetchVisitId,
  findVisitUser,
  fetchVisitDestiny,
  createDeparture,
  maxUserVisit,
  fetchZoneById,
  fetchAllZones,
  zoneMaxVisit,
  destinyMaxVisit,
  suspendEmployee,
  verifyLogin,
  updateProfile
};

//DELETE ANYTHING FROM API
export async function deleteInfo(url, arrayIds) {
  try {
    const res = await axios.delete(`${API_PORT()}/api/${url}/${arrayIds}`)
    return res.data;
  } catch (error) {
    return error.message;
  }
}
//SAVE INFO TO API
export async function createInfo(url, params, data) {
  console.log(url, params, data);
  try {
    const res = await axios.post(`${API_PORT()}/api/${url}/${params}`, data);
    return res.data;
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

//ALL EMPLOYEES BY COMPANY
export async function fetchAllEmployee(companyId) {
  try {
    const res = await axios.get(`${API_PORT()}/api/user/${companyId}`);
    return res;
  } catch (error) {
    return error.message;
  }
}

//ALL EMPLOYEE FROM 1 ZONE
export async function fetchEmployeeByZone(zoneId) {
  try {
    const res = await axios.get(`${API_PORT()}/api/user/zone/${zoneId}`);
    return res;
  } catch (error) {
    return error.message;
  }
}



//RECOVER PASS
export async function recoverPass(email, data) {
  console.log("email y data:----", email, data);
  try {
    const res = await axios.post(`${API_PORT()}/api/password/${email}`, {
      password: data,
    });
    console.log("RES-DATA---------", res);
    return res.data;
  } catch (error) {
    return error;
  }
}
//CREATE COMPANY AND ADMIN
export async function createCompany(adminData, companyData) {
  const {
    name,
    lastName,
    dni,
    email,
    repPass,
    uri,
    fileName,
    fileType,
  } = adminData;
  const {
    uriLogo,
    fileNameLogo,
    fileTypeLogo,
    companyName,
    businessName,
    nic,
    address,
    city,
    phoneNumber,
    phoneNumberOther,
  } = companyData;

  let data = new FormData();
  data.append("name", name);
  data.append("lastName", lastName);
  data.append("dni", dni);
  data.append("email", email);
  data.append("password", repPass);
  data.append("companyName", companyName);
  data.append("businessName", businessName);
  data.append("nic", nic);
  if (address) {
    data.append("address", address);
  }
  if (city) {
    data.append("city", city);
  }
  if (phoneNumberOther) {
    data.append("phoneNumberOther", phoneNumberOther);
  }
  data.append("phoneNumber", phoneNumber);
  data.append("visits", 0);
  data.append("file", { uri, name: fileName, type: fileType });
  if (uriLogo) {
    data.append("file", {
      uri: uriLogo,
      name: fileNameLogo,
      type: fileTypeLogo,
    });
  }

  try {
    const res = await axios.post(`${API_PORT()}/api/company`, data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    return error.message;
  }
}

//LOGIN
export async function login(email, password) {
  // console.log(data);
  try {
    const res = await axios.post(`${API_PORT()}/api/login`, {email, password});
    // if (!res.data.error) {
    //   console.log("RES DE LOGIN---------", res.data);

    //   let slogin = {
    //     token: res.data.token,
    //     userId: res.data.data.id,
    //   };

    //   let sprofile = {
    //     id: res.data.data.Employee.id,
    //     dni: res.data.data.Employee.dni,
    //     name: res.data.data.Employee.name,
    //     lastName: res.data.data.Employee.lastName,
    //     picture: res.data.data.Employee.picture,
    //     email: res.data.data.email,
    //   };
    //   if (res.data.data.userZone.length > 0) {
    //     sprofile.userZone = res.data.data.userZone;
    //   }
    //   let company = [];
    //   res.data.data.UserCompany.map((comp) => {
    //     company.push({
    //       id: comp.Company.id,
    //       companyName: comp.Company.companyName,
    //       businessName: comp.Company.businessName,
    //       nic: comp.Company.nic,
    //       city: comp.Company.city,
    //       address: comp.Company.address,
    //       phoneNumber: comp.Company.phoneNumber,
    //       phoneNumberOther: comp.Company.phoneNumberOther,
    //       logo: comp.Company.logo,
    //       privilege: comp.privilege,
    //       select: true,
    //     });
    //   });
    //   let privilege = res.data.data.UserCompany[0].privilege;
    //   let token = res.data.token
    //   // await storage.removeItem("userToken", res.data.token);
    //   // await storage.setItem("userToken", res.data.token);
    //   return { slogin, sprofile, company, privilege, token };
    // } else {
    //   return res;
    // }
    console.log("LOGIN----", res.data);
    return res;
  } catch (error) {
    return error;
  }
}
//CREATE SUPERVISOR
export async function createSupervisor(employeeData) {
  const {
    name,
    lastName,
    dni,
    email,
    password,
    privilege,
    assignationDate,
    changeTurnDate,
    uri,
    fileName,
    fileType,
    zoneId,
    companyId,
  } = employeeData;
  console.log("privilege FETCH SUPER--", privilege);
  let data = new FormData();
  data.append("name", name);
  data.append("lastName", lastName);
  data.append("dni", dni);
  data.append("email", email);
  data.append("password", "12345");
  data.append("privilege", privilege);
  data.append("assignationDate", assignationDate.toISOString());
  data.append("changeTurnDate", changeTurnDate.toISOString());
  data.append("file", { uri, name: fileName, type: fileType });
  data.append("zoneId", zoneId);
  data.append("companyId", companyId);

  try {
    const res = await axios.post(`${API_PORT()}/api/supervisor`, data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    console.log("RES DE CREAR SUPER--------", res.data);
    return res;
  } catch (error) {
    console.log(error);
  }
}
//CREATE WATCHMAN
export async function createWatchman(employeeData) {
  const {
    name,
    lastName,
    dni,
    email,
    password,
    privilege,
    assignationDate,
    changeTurnDate,
    uri,
    fileName,
    fileType,
    zoneId,
    companyId,
  } = employeeData;
  console.log("privilege FETCH WACT--", privilege);
  let data = new FormData();
  data.append("name", name);
  data.append("lastName", lastName);
  data.append("dni", dni);
  data.append("email", email);
  data.append("password", "12345");
  data.append("privilege", privilege);
  data.append("assignationDate", assignationDate.toISOString());
  data.append("changeTurnDate", changeTurnDate.toISOString());
  data.append("file", { uri, name: fileName, type: fileType });
  data.append("zoneId", zoneId);
  data.append("companyId", companyId);

  try {
    const res = await axios.post(`${API_PORT()}/api/watchman`, data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}



