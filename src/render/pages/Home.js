const { ipcRenderer } = require('electron')
import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code";

export function Home() {

    const [value, setvalue] = useState('')

    useEffect(async () => {
        const ip = await ipcRenderer.invoke('get-hostname')
        setvalue(`${ip.eno1[0]}:2121`)

    }, [])

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            height: "100vh",
            width: "100%"
        }}>
            <div style={{ width: "50%", height: "100%", boxSizing:"border-box",padding:"0 20px", display:"flex",justifyContent:"center", alignItems:"center"}}>
                <h2>Escanea desde la app <span style={{color:'#2CDA9D'}}>LockSpace</span> para cargar tus contraseñas</h2>
            </div>
            <div style={{ width: "50%", height: "100%", background: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <QRCode value={value} />
            </div>


        </div>
    )
}
