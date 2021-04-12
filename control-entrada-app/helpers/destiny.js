import axios from "axios";
import { API_PORT } from "../config/index";
import { storage } from "./asyncStorage";

//CREATE DESTINY
export async function createDestiny(name, zoneId) {
  const token = await storage.getItem("userToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    `${API_PORT()}/api/destiny/${zoneId}`,
    {name},
    config
  );
  return res;
}

//DELETE DESTINY
export async function deleteDestiny(destinyId) {
  const token = await storage.getItem("userToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(
    `${API_PORT()}/api/destiny/${destinyId}`,
    config
  );
  return res;
}
