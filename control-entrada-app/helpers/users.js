import axios from "axios";
import { API_PORT } from "../config/index";

//virifyLogin
export async function verifyLogin(token) {
  const res = await axios.get(`${API_PORT()}/api/verifyLogin`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return res;
}

//SAVE DEVICETOKEN
export async function saveDeviceToken(token, id){
  console.log("id-",id)
  const res = axios.post(`${API_PORT()}/api/token/${id}`, {token})
  return res
}

//UPDATE PROFILE
export async function updateProfile(formData, profileId) {
  const {
    repPass,
    nic,
    address,
    city,
    number,
    numberTwo,
    uri,
    fileName,
    fileType,
    logouri,
    logofileName,
    logofileType,
  } = formData;
  let data = new FormData();

  if (repPass) {
    data.append("password", repPass);
  }
  if (nic) {
    data.append("nic", nic);
  }
  if (address) {
    data.append("address", address);
  }
  if (city) {
    data.append("city", city);
  }
  if (number) {
    data.append("number", number);
  }
  if (numberTwo) {
    data.append("numberTwo", numberTwo);
  }
  if (uri) {
    data.append("file", { uri, name: fileName, type: fileType });
    data.append("profile", "profile")
  }
  if (logouri) {
    data.append("file", { uri: logouri, name: logofileName, type: logofileType });
    data.append("logo", "logo")
  }

  const res = await axios.put(`${API_PORT()}/api/profile/${profileId}`, data, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  return res;
}

//SUSPEND EMPLOYEE
export async function suspendEmployee(id) {
  const res = await axios.put(`${API_PORT()}/api/user/${id}`);
  return res;
}
