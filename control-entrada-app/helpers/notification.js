import axios from "axios";
import { API_PORT } from "../config/index";

//fetchAllNotification not read it to one user
export const fetchNotificationNotRead = async (userId) => {
    const res = await axios.get(`${API_PORT()}/api/notification/${userId}`)
    return res
}