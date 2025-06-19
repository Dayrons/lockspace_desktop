import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterPasswords } from "../context/slice/AppSlice";
import { open } from "../context/slice/MenuItemsSlice";
import { IconButton } from "@mui/material";
import { IoMenu, IoClose, IoSearch } from "react-icons/io5";
import logo from "../../assets/logo.png"
export function Navbar() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.menuItems);

  return (
    <div
      style={{
        margin: "auto",
        position: "relative",
        top: "0",
        width: "100%",
        background: "rgba(43, 46, 61,0.5)",
        boxSizing: "border-box",
        padding: "20px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
        }}
      >
       <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
       }}>
        {/* <img src={logo} alt="Logo" style={{ width: "60px", height: "60px" }} /> */}

         <div style={{
              color: "white",
              // height: "30px",
              width: "260px",
              boxSizing: "border-box",
              borderRadius: "5px",
              padding: "0 5px",
              background: "#1c1d22",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              outline: "none",
              '::placeholder': {
                color: 'white',
                opacity: 1,
              },
            }}>

          <input
            placeholder="Buscar contraseña"
            autoFocus
            type="search"
            onKeyUp={(e) => {
              dispatch(filterPasswords(e.target.value));
            }}
            style={{
              color: "white",
              height: "30px",
              width: "80%",
              boxSizing: "border-box",
              // borderRadius: "5px",
              padding: "20px 0",
              background: "none",
              border: "none",
              outline: "none",
              '::placeholder': {
                color: 'white',
                opacity: 1,
              },
            }}
          />
          
          <IoSearch/>

        </div>
       </div>

        <IconButton size="large" onClick={() => dispatch(open())}>
          {state.isOpen ? <IoClose color="white" /> : <IoMenu color="white" />}
        </IconButton>
      </div>
      {/* Estilo global para el placeholder */}
      <style>
        {`
          input::placeholder {
            color: white !important;
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
}
