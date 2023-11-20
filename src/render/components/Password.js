import React from 'react'
import IconButton from '@mui/material/IconButton';
import { IoCopy } from "react-icons/io5";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
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
                            padding: "5px 10px",
                            cursor:"grab"
                        }}
                    >
                        <RiDraggable />

                    </div>
                    <h3>{password.titulo}</h3>
                </div>


                <CopyToClipboard text={password.password}
                >
                    <IconButton size='small' onClick={(e) => {toast('Contraseña copiada')}}>
                        <IoCopy color='#2CDA9D' />
                    </IconButton>
                </CopyToClipboard>
            </div>

        </>

    )
}
