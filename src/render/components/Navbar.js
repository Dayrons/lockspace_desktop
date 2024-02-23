import React from 'react'
import {  useDispatch } from 'react-redux'
import { filterPasswords } from '../context/slice/AppSlice'
import { IconButton } from '@mui/material'
import { IoMenu } from "react-icons/io5";
export function Navbar() {

  const dispatch = useDispatch()
  return (
    <div style={{
      margin: "auto",
      position:"relative",
      top: "0",
      width: "100%",
      background: "rgba(43, 46, 61,0.5)",
      boxSizing: "border-box",
      padding:"10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

    }}>
      <input type="search" 
      
      onKeyUp={(e)=>{dispatch(filterPasswords(e.target.value))}}
      style={{
        color:"white",
        height: "30px",
        width: "260px",
        boxSizing: "border-box",
        borderRadius:"5px",
        padding: "20px",
        background:"#1c1d22",
        border:"none",
        outline:"none"
      }}
      />
      <IconButton size='large'>
          <IoMenu color='white'/>
      </IconButton>

    </div>
  )
}
