import React from 'react'

export function MenuItems() {
  return (
    <div style={{
        height: "91vh",
        position:"absolute",
        // right: "-360px",
        right: "0",
        background: "rgba(43, 46, 61)",
        width: "360px",
        zIndex: "1000",
        boxSizing: "border-box",
        
        // paddingTop:"20px",
        overflow:"auto"
    }}>
      {[1,2,3,4,5,6,7,8,9].map((item,index)=>{
        return(
          <Item key={index}/>
        )
      })}

    </div>
  )
}


export function Item(){

  return(
    <div className='menu-item' style={{
      padding:"5px",
      color:"white",
      fontSize:"16px",
      borderBottom:"1px solid white",
      cursor:"pointer",
      transition:"0.3s",
      "&:hover":{
        
      }
    }}>
      <p>Item 1</p>
    </div>
  )
}

