import React from 'react'
import IconButton from '@mui/material/IconButton';
import { IoCopy } from "react-icons/io5";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { RiDraggable } from "react-icons/ri";
export function Password({ password }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: password.id
    })

    return (

            

            <div style={{
                width: "95%",
                height: "25px",
                padding: "20px",

                background: "#1c1d22",
                borderRadius:"10px",
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transform: CSS.Transform.toString(transform),
                transition,
            }}



            >
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>

                    <div
                        ref={setNodeRef}
                        {...attributes}
                        {...listeners}
                        style={{
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            padding: "10px ",
                            borderRadius:"5px",
                            cursor:"grab",
                            marginRight:"10px",
                            background: "rgba(43, 46, 61)",
                        }}
                    >
                        <RiDraggable />

                    </div>
                    <h3>{password.titulo}</h3>
                </div>


                <CopyToClipboard text={password.password}
                >
                    <IconButton size='small' onClick={(e) => {toast.success('Contraseña copiada')}}>
                        <IoCopy color='#2CDA9D' />
                    </IconButton>
                </CopyToClipboard>
            </div>


    )
}
