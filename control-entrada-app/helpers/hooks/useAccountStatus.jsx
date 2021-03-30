import { useState, useEffect } from 'react'
import { helpers } from '../index'
import { storage } from '../asyncStorage'

export const useAccountStatus = () => {
    const [status, setStatus] = useState()
        const [message, setMessage] = useState()
    
        const verifiyAccountStatus = async () => {
            const token = await storage.getItem('userToken')
            try {
                const res = await helpers.verifyLogin(token)
                if(res.data.msg === 'Cuenta suspendida'){
                    setStatus(false)
                    setMessage(res.data.msg)
                }
            } catch (error) {
                console.log(error)
            }
        }

        useEffect(() => {
            verifiyAccountStatus()
        }, [])
        return { status, message }
    }
    
    
    
    
    