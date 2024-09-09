import React from 'react'
import {  useDispatch, useSelector} from 'react-redux'
import { filterPasswords } from '../context/slice/AppSlice'
import { open } from '../context/slice/MenuItemsSlice';
import { IconButton } from '@mui/material'
import { IoMenu, IoClose} from "react-icons/io5";


export function Navbar() {

  const dispatch = useDispatch()
  const state = useSelector(state => state.menuItems)


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
      <IconButton size='large' onClick={()=>dispatch(open())}>
           {state.isOpen ? <IoClose color='white'/>:<IoMenu color='white'/>}
      </IconButton>

    </div>
  )
}
