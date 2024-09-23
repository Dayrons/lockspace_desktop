import React from "react";
import { Password } from "./Password";
import { useSelector, useDispatch } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { setPasswords } from "../context/slice/AppSlice";
import { Toaster } from "react-hot-toast";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png"

export function ListPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.app);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    const passwords = state.passwords;
    const oldIndex = passwords.findIndex(
      (password) => active.id === password.id
    );
    const newIndex = passwords.findIndex((password) => over.id === password.id);
    const newArray = arrayMove(passwords, oldIndex, newIndex);
    dispatch(setPasswords(newArray));
  };

  return (
    <>
      <Toaster />

      <div
        style={{
          width: "80%",
          height: "90vh",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          // justifyContent:"center",
          flexWrap: "nowrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxHeight: "70%",
            minHeight:"50%",
            boxSizing: "border-box",
            padding: "20px",
            marginTop: "20px",
            background: "rgba(43, 46, 61)",
            overflowY: "scroll",
            overflowX:"hidden",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: state.passwords.length > 0 ? "start": "center",
            alignItems: "center",
          }}
          className="scroll"
        >
          {state.passwords.length > 0 ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={state.passwords}
                strategy={verticalListSortingStrategy}
              >
                {state.passwords.map((password) => (
                  <Password password={password} />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div style={{
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center",
              opacity:"0.5"
            }}>
              <img src={logo}  style={{
                width:"180px",
                filter:" grayscale(100%)",
              }} />
              <h2 style={{margin:"0"}}>Aun no registras ninguna contraseña</h2>
              <p>
                Da un click para comenzar
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            height: "50px",
            // width:"50px",
            borderRadius: "10px",
            boxSizing: "border-box",
            padding: "10px",
            marginTop: "20px",
            background: "rgba(44, 218, 157, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
   
          }}

          onClick={()=> navigate('/register-password')}
        >
          <IoAddOutline size={25} />
          <span style={{fontWeight:"bold"}}>Registrar contraseña</span>
        </div>
      </div>
    </>
  );
}
