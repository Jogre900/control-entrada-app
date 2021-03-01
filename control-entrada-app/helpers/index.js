import { useState } from "react";
import axios from "axios";
import { LoadingModal } from "../components/loadingModal";
let check = false;
  let msg = "";
  let item = null
export async function deleteInfo(url, arrayIds) {
  //const [loading, setLoading] = useState(false)
  
  try {
    const res = await axios({
      method: "DELETE",
      url: url,
      data: { id: arrayIds },
    });
    if (!res.data.error) {
      console.log("RES DE BORRAR-------",res.data)
      check = true;
      msg = res.data.msg;
      
      return {check, msg}
    } else {
      msg = res.data.msg;
      return check, msg;
    }
  } catch (error) {
    msg = error.message;
    return {check, msg}
  }
}
