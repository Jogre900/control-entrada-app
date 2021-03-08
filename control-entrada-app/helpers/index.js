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
  let form = new FormData();
  form.append("name", name);
  form.append("lastName", lastName);
  form.append("dni", dni);
  form.append("email", email);
  form.append("repPass", repPass);
  form.append("companyName", companyName);
  form.append("businessName", businessName);
  form.append("nic", nic);
  form.append("address", address);
  form.append("city", city);
  form.append("phoneNumber", phoneNumber);
  form.append("phoneNumberOther", phoneNumberOther);
  form.append("files", uri, fileName, fileType);
  form.append("files", uriLogo, fileNameLogo, fileTypeLogo);

  try {
    const res = await axios.post(`${API_PORT()}/api/company`, data);
    return res.data;
  } catch (error) {
    return error;
  }
}
