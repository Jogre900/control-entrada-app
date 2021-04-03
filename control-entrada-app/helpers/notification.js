import axios from "axios";
import { API_PORT } from "../config/index";

//fetchAllNotification FROM ONE USER
export const fetchNotification = async (userId, unread = null) => {
    console.log(userId)
    const res = await axios.get(`${API_PORT()}/api/notification/${userId}/${unread}`)
    return res
}

//CHANGE READ STATUS
export const changeReadStatus = async (id = null) => {
    const res = await axios.put(`${API_PORT()}/api/notification/${id}`)
    return res
}