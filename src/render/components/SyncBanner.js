import React from "react";
import { useSelector } from "react-redux";
import { IoLink, IoClose } from "react-icons/io5";

/**
 * Banner de conexión MQTT: muestra si la app Flutter está conectada via FTP.
 * Verde con "App conectada" cuando hay conexión.
 * Al presionar, muestra opción para cerrar la conexión.
 */
export function SyncBanner() {
  const clientConnected = useSelector((state) => state.ftp.clientConnected);

  if (!clientConnected) return null;

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(44, 218, 157, 0.15)",
        borderBottom: "1px solid rgba(44, 218, 157, 0.3)",
        padding: "8px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
      title="App LockSpace conectada - sincronización activa"
    >
      <IoLink style={{ color: "rgba(44, 218, 157, 1)", fontSize: "16px" }} />
      <span
        style={{
          color: "rgba(44, 218, 157, 1)",
          fontSize: "13px",
          fontWeight: "bold",
        }}
      >
        App conectada
      </span>
    </div>
  );
}
