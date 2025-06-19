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

  // Utilidad para mapear la posición del mouse a un desplazamiento de sombra
  function getShadowFromPointer(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Limita el desplazamiento máximo de la sombra
    const maxOffset = 16;
    const offsetX = Math.max(Math.min(x / 10, maxOffset), -maxOffset);
    const offsetY = Math.max(Math.min(y / 10, maxOffset), -maxOffset);
    return `${offsetX}px ${offsetY}px 28px 0 rgba(44, 218, 157, 0.32)`;
  }

  // Estado para forzar el re-render y actualizar la sombra
  const [shadow, setShadow] = React.useState("0 4px 16px 0 rgba(44, 218, 157, 0.25)");
  const buttonRef = React.useRef(null);

  // Actualiza la sombra en cada movimiento del mouse sobre el documento si el botón está activo
  React.useEffect(() => {
    function handleMouseMove(e) {
      if (buttonRef.current && document.activeElement === buttonRef.current) {
        setShadow(getShadowFromPointer(e, buttonRef.current));
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
          flexWrap: "nowrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxHeight: "75%",
            minHeight: "75%",
            boxSizing: "border-box",
            padding: "20px",
            marginTop: "20px",
            background: "rgba(43, 46, 61)",
            overflowY: "scroll",
            overflowX: "hidden",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: state.passwords.length > 0 ? "start" : "center",
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
                  <Password key={password.id} password={password} />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                opacity: "0.5",
              }}
            >
              <img
                src={logo}
                style={{
                  width: "180px",
                  filter: " grayscale(100%)",
                }}
              />
              <h2 style={{ margin: "0" }}>Aun no registras ninguna contraseña</h2>
              <p>Da un click para comenzar</p>
            </div>
          )}
        </div>

        <div
          ref={buttonRef}
          tabIndex={0}
          style={{
            height: "40px",
            minWidth: "200px",
            borderRadius: "10px",
            boxSizing: "border-box",
            padding: "0 15px",
            marginTop: "20px",
            background: "rgba(44, 218, 157, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: shadow,
            transition: "background 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            fontWeight: "bold",
            fontSize: "15px",
            gap: "10px",
            border: "none",
            outline: "none",
          }}
          onClick={() => navigate('/register-password')}
          onMouseOver={e => {
            e.currentTarget.style.background = "rgba(44, 218, 157, 1)";
            e.currentTarget.style.transform = "translateY(-1px) scale(1.015)";
            setShadow(getShadowFromPointer(e, e.currentTarget));
            e.currentTarget.focus();
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "rgba(44, 218, 157, 0.85)";
            setShadow("0 4px 16px 0 rgba(44, 218, 157, 0.25)");
            e.currentTarget.style.transform = "none";
          }}
          onMouseMove={e => {
            setShadow(getShadowFromPointer(e, e.currentTarget));
          }}
        >
          <IoAddOutline size={22} />
          <span>Registrar contraseña</span>
        </div>
      </div>
    </>
  );
}
