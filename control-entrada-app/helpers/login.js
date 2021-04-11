import React from 'react'
import axios from "axios";
import { API_PORT } from "../config/index";
import { storage } from "./asyncStorage";
import { useDispatch } from "react-redux";

//LOGIN
export async function login(email, password) {
  const deviceToken = await storage.getItem("deviceToken");
  console.log("token from local storage-", deviceToken);
  // console.log(data);
  try {
    const res = await axios.post(`${API_PORT()}/api/login`, {
      email,
      password,
      deviceToken,
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
    console.log("LOGIN----", res.data);
    return res;
  } catch (error) {
    return error;
  }
}
//LOGOUT
export async function logOut(userId) {
  // const dispatch = useDispatch()
  // const clearRedux = () => {
  //   return new Promise((resolve, reject) => {
  //     resolve(dispatch({ type: "CLEAR_STORAGE" }));
  //   });
  // };
  //const deleteToken = async () => await storage.removeItem("userToken");
  const res = await axios.put(`${API_PORT()}/api/logout/${userId}`);
  return res
  // if(res){
  //   clearRedux().then(() => deleteToken()).then(() => res)
  // }
  
}
