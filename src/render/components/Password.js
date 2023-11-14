import React from 'react'
import IconButton from '@mui/material/IconButton';
import { IoCopy } from "react-icons/io5";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
export function Password({ password }) {
    return (
        <>
          <Toaster />

          <div style={{
            width: "100%",
            height: "25px",
            padding: "10px",
            background: "rgba(43, 46, 61,0.5)",
            margin: "20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <h3>Password</h3>

            <CopyToClipboard text={"Copiar"}
                onCopy={() => toast('Contraseña copiada')}>
                <IconButton size='small' >
                    <IoCopy color='#2CDA9D' />
                </IconButton>
            </CopyToClipboard>
        </div>

        </>
        
    )
}
