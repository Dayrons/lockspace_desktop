import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterPasswords } from "../context/slice/AppSlice";
import { open } from "../context/slice/MenuItemsSlice";
import { IconButton } from "@mui/material";
import { IoMenu, IoClose } from "react-icons/io5";
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
        }}
      >
        <div>
          {/* colocar icono De lupa */}

          <input
            type="search"
            onKeyUp={(e) => {
              dispatch(filterPasswords(e.target.value));
            }}
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
            }}
          />
        </div>

        <IconButton size="large" onClick={() => dispatch(open())}>
          {state.isOpen ? <IoClose color="white" /> : <IoMenu color="white" />}
        </IconButton>
      </div>
    </div>
  );
}
