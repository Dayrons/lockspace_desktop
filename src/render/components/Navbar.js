import React from 'react'

export function Navbar() {
  return (
    <div style={{
      margin: "auto",
      width: "65%",
      background: "rgba(43, 46, 61,0.5)",
      borderRadius:"5px",
      marginTop:"20px"

    }}>
      <input type="search" style={{
        color:"white",
        height: "45px",
        width: "100%",
        boxSizing: "border-box",
        padding: "20px 0",
        background:"none",
        border:"none",
        outline:"none"
      }}
      />
    </div>
  )
}
