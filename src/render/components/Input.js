import React from 'react'

export default function Input({style,onKeyUp,title,styleText,inputType ="text", value="", name="", id="", onChange=()=>{}}) {
  return (
   <div>
    <h3 style={{margin:0, marginBottom:"10px",styleText}}>{title}</h3>
     <input
            type={inputType}
            onKeyUp={onKeyUp}
            value={value}
            name={name}
            onChange={onChange}
            id={id}
            style={{
              color: "white",
              height: "30px",
              width: "260px",
              boxSizing: "border-box",
              borderRadius: "5px",
              padding: "20px",
              background: "#1c1d22",
              border: "none",
              outline: "none",
              ...style
            }}
          />
   </div>
  )
}
