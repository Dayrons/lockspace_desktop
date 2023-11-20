const { ipcRenderer } = require('electron')
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code";
import { useDispatch, useSelector} from 'react-redux'
import { setPasswords } from '../context/slice/AppSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export function Home() {
     const state = useSelector(state => state.app)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [value, setvalue] = useState('')

    const getFile = async () => {
        const response = await ipcRenderer.invoke('get-file')
        if (response != null) {
            dispatch(setPasswords(response))
            navigate('/page-password')

        } else {
            toast.error("Intenta conectar nuevamente")
        }

    }

    useEffect(async () => {
        if(state.passwords != null){
            navigate('/page-password')
        }else{
            const ip = await ipcRenderer.invoke('get-hostname')
            setvalue(`${ip.eno1[0]}`)
        }
        

    }, [])

    return (
        <>
            <Toaster />

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                height: "100vh",
                width: "100%"
            }}>
                <div style={{
                    width: "50%",
                    height: "100%",
                    boxSizing: "border-box",
                    padding: "0 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <div>
                        <h2>Escanea desde la app <span style={{ color: '#2CDA9D' }}>LockSpace</span> para cargar tus contraseñas</h2>
                    </div>
                    <Button variant="contained" color='success' onClick={getFile} >Conectado</Button>
                </div>
                <div style={{ width: "50%", height: "100%", background: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <QRCode value={value} />
                </div>

            </div>

        </>

    )
}
