import React from 'react'
import {  useDispatch } from 'react-redux'
import { filterPasswords } from '../context/slice/AppSlice'
export function Navbar() {

  const dispatch = useDispatch()
  return (
    <div style={{
      margin: "auto",
      width: "65%",
      background: "rgba(43, 46, 61,0.5)",
      borderRadius:"5px",
      marginTop:"20px"

    }}>
      <input type="search" 
      
      onKeyUp={(e)=>{dispatch(filterPasswords(e.target.value))}}
      style={{
        color:"white",
        height: "45px",
        width: "100%",
        boxSizing: "border-box",
        padding: "20px",
        background:"none",
        border:"none",
        outline:"none"
      }}
      />
    </div>
  )
}
