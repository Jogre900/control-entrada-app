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

//CREATE VISIT
export async function createVisit(visitData, token) {
  const {
    name,
    lastName,
    dni,
    profileUri,
    profileFileName,
    profileFileType,
    entryDate,
    departureDate,
    descriptionEntry,
    visitUri,
    visitFileName,
    visitFileType,
    userZoneId,
    destinyId
  } = visitData;
  let data = new FormData();
  data.append('name', name)
  data.append('lastName', lastName)
  data.append('dni', dni)
  data.append('file', {uri: profileUri, name: profileFileName, type: profileFileType})
  data.append('descriptionEntry', descriptionEntry)
  data.append('entryDate', entryDate.toISOString())
  data.append('departureDate', departureDate.toISOString())
  data.append('file', {uri: visitUri, name: visitFileName, type: visitFileType})
  data.append('userZoneId', userZoneId)
  data.append('destinyId', destinyId)
  try {
    const res = await axios.post(`${API_PORT()}/api/visit`, data, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `bearer ${token}`,
      },
    });
    return res
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

//FIND VISIT BY DNI
export async function findVisitdni(dni){
  try {
    const res = await axios.get(`${API_PORT()}/api/visit/${dni}`)
    return res
  } catch (error) {
    console.log(`Error: ${error.message}`)
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
    const res = await axios.get(`${API_PORT()}/api/user/${zoneId}`);
    return res;
  } catch (error) {
    return error.message;
  }
}

//UPDATE PROFILE
export async function updateProfile(formData, fileData, profileId) {
  const { email, pass, repPass, nic, number, numberTwo } = formData;
  const { uri, fileName, fileType } = fileData;
  let data = new FormData();

  data.append("email", email);
  data.append("password", repPass);
  data.append("nic", nic);
  data.append("number", number);
  data.append("numberTwo", numberTwo);
  data.append("file", { uri, name: fileName, type: fileType });
  try {
    const res = await axios.post(
      `${API_PORT()}/api/profile/${profileId}`,
      data,
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    );
    if (!res.data.error) {
      let slogin = {
        token: res.data.token,
        userId: res.data.data.id,
        privilege: res.data.data.UserCompany[0].privilege,
      };
      let sprofile = {
        id: res.data.data.Employee.id,
        dni: res.data.data.Employee.dni,
        name: res.data.data.Employee.name,
        lastName: res.data.data.Employee.lastName,
        picture: res.data.data.Employee.picture,
        email: res.data.data.email,
      };
      let company = [];
      res.data.data.UserCompany.map((comp) => {
        company.push({
          id: comp.Company.id,
          companyName: comp.Company.companyName,
          businessName: comp.Company.businessName,
          nic: comp.Company.nic,
          city: comp.Company.city,
          address: comp.Company.address,
          phoneNumber: comp.Company.phoneNumber,
          phoneNumberOther: comp.Company.phoneNumberOther,
          logo: comp.Company.logo,
          privilege: comp.privilege,
          select: true,
        });
      });

      await storage.removeItem("userToken");
      await storage.setItem("userToken", res.data.token);
      return { slogin, sprofile, company, res };
    }
  } catch (error) {
    return { error };
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
export async function createCompany(companyData, profilePic, companyLogo) {
  const {
    name,
    lastName,
    dni,
    email,
    repPass,
    companyName,
    businessName,
    nic,
    address,
    city,
    phoneNumber,
    phoneNumberOther,
  } = companyData;
  const { uri, fileName, fileType } = profilePic;
  const { uriLogo, fileNameLogo, fileTypeLogo } = companyLogo;
  let data = new FormData();
  data.append("name", name);
  data.append("lastName", lastName);
  data.append("dni", dni);
  data.append("email", email);
  data.append("password", repPass);
  data.append("companyName", companyName);
  data.append("businessName", businessName);
  data.append("nic", nic);
  data.append("address", address);
  data.append("city", city);
  data.append("phoneNumber", phoneNumber);
  data.append("phoneNumberOther", phoneNumberOther);
  data.append("file", { uri, name: fileName, type: fileType });
  data.append("file", { uri: uriLogo, name: fileNameLogo, type: fileTypeLogo });

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
export async function login(loginData) {
  const { email, password } = loginData;
  try {
    const res = await axios.post(`${API_PORT()}/api/login`, {
      email,
      password,
    });
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

  let data = new FormData();
  data.append("name", name);
  data.append("lastName", lastName);
  data.append("dni", dni);
  data.append("email", email);
  data.append("password", password);
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

  let data = new FormData();
  data.append("name", name);
  data.append("lastName", lastName);
  data.append("dni", dni);
  data.append("email", email);
  data.append("password", password);
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
