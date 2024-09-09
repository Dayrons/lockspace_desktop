import React from 'react'
import {  useSelector} from 'react-redux'
import { FiLogOut } from "react-icons/fi";
import { IoQrCode } from "react-icons/io5";

export function MenuItems() {
  const state = useSelector(state => state.menuItems)
  const items = [
    {
      title:"Cerra sesion",
      icon: <FiLogOut />,
      function:()=>{}
    },
    {
      title:"Sincronizar",
      icon: <IoQrCode />,
      function:()=>{}
    },
  ]

  return (
    <div style={{
        height: "91vh",
        position:"absolute",
        transition: "all 0.5s ease",
        right: state.isOpen ?"0px" :"-260px",
        background: "rgba(43, 46, 61)",
        width :"260px",
        zIndex: "1000",
        boxSizing: "border-box",
        
        // paddingTop:"20px",
        overflow:"auto"
    }}>
      {items.map((item,index)=>{
        return(
          <Item key={index} item={item}/>
        )
      })}

    </div>
  )
}


export function Item({item}){

  return(
    <div className='menu-item' style={{
      padding:"10px",
      margin:"10px",
      background:" #1c1d22",
      borderRadius:"5px",
      color:"white",
      fontSize:"16px",
      // borderBottom:"1px solid white",
      cursor:"pointer",
      transition:"0.3s",
      "&:hover":{
        
      }
    }}>
      <div style={{
        display:"flex",
        alignItems:"center",
        alignContent:"center"
      }}>
        <div style={{
          width:"30px",
          height:"30px",
          borderRadius:"2px",
          background:"rgba(44, 218, 157, 0.2)",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          marginRight:"10px",
          color:"#2CDA9D"
        }}>
         {item.icon}
        </div>
      
         <span>{item.title}</span>
      </div>
    </div>
  )
}

