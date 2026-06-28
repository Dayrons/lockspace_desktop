const { ipcRenderer } = require("electron");
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setMasterPassword } from "../context/slice/UserSlice";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

/**
 * Pantalla de desbloqueo: se muestra cuando la app inicia y hay un usuario
 * guardado en localStorage pero la masterPassword no está en memoria.
 * Esto ocurre después de cerrar/reiniciar la app (la key se pierde al cerrar el proceso).
 * El usuario debe ingresar su contraseña para derivar la key y poder desencriptar.
 */
export function UnlockPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Ingresa tu contraseña");
      return;
    }

    setLoading(true);
    try {
      // Verificar que la contraseña es correcta intentando hacer login
      let res = await ipcRenderer.invoke("singin", {
        name: user.name,
        password: password,
      });
      res = JSON.parse(res);

      if (res.error) {
        toast.error("Contraseña incorrecta");
      } else {
        // Contraseña válida: guardar masterPassword en memoria (Redux, NO localStorage)
        dispatch(setMasterPassword(password));
        dispatch(setUser(res.data));
        navigate("/page-password");
      }
    } catch (error) {
      toast.error("Error al desbloquear");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#1c1d22",
      }}
    >
      <Toaster />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1 style={{ color: "white", margin: 0 }}>
          Hola, {user?.name || "Usuario"}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
          Ingresa tu contraseña para desbloquear
        </p>
        <form
          onSubmit={handleUnlock}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            width: "300px",
          }}
        >
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              color: "white",
              height: "40px",
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "8px",
              padding: "0 15px",
              background: "#2b2e3d",
              border: "none",
              outline: "none",
              fontSize: "14px",
            }}
          />
          {loading ? (
            <CircularProgress sx={{ color: "rgba(44, 218, 157, 1)" }} />
          ) : (
            <button
              type="submit"
              style={{
                height: "45px",
                width: "100%",
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                background: "rgba(44, 218, 157, 1)",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Desbloquear
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
