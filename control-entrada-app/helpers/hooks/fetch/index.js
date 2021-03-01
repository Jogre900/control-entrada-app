import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_PORT } from "../../../config/index";

export function useCreateDestiny({destinyName, zoneId}) {
    const [data, setData] = useState()
    
    const createDestiny = async (destinyName) => {
        try {
            const res = await axios.post(`${API_PORT()}/api/createDestiny/${zoneId}`, {
                name: destinyName
            })
            if(!res.data.error){
                setData(res.data.data)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        createDestiny()
    }, [destinyName, zoneId])
    return (
        data
    )
}

