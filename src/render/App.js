import React, { useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import './App.scss'
import { Home } from './pages/Home'
import { PagePassword } from './pages/PagePasswords'
import { RegisterPassword } from './pages/RegisterPassword'
import { SignupPage } from './pages/SignupPage'
import { UnlockPage } from './pages/UnlockPage'
import { useSelector, useDispatch } from 'react-redux'
import { setClientConnected } from './context/slice/FtpSlice'
const { ipcRenderer } = require("electron");

/**
 * Banner de conexión que escucha IPC del main process.
 * Se muestra fijo en la parte superior, empujando el contenido hacia abajo.
 */
function GlobalSyncBanner({ visible }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const onConnected = () => dispatch(setClientConnected(true));
    const onDisconnected = () => dispatch(setClientConnected(false));
    ipcRenderer.on("ftp-client-connected", onConnected);
    ipcRenderer.on("ftp-client-disconnected", onDisconnected);
    return () => {
      ipcRenderer.removeListener("ftp-client-connected", onConnected);
      ipcRenderer.removeListener("ftp-client-disconnected", onDisconnected);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "8px",
        right: "8px",
        background: "rgba(44, 218, 157, 0.9)",
        padding: "6px 10px",
        borderRadius: "8px 0 0 8px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(44, 218, 157, 0.3)",
      }}
      title="App LockSpace conectada - click para desconectar"
    >
      <span style={{ color: "#1c1d22", fontSize: "11px", fontWeight: "bold" }}>
        ● App conectada
      </span>
    </div>
  );
}

function RootRoute() {
  const user = useSelector((state) => state.user.user);
  const masterPassword = useSelector((state) => state.user.masterPassword);

  if (user && user.id) {
    if (masterPassword) {
      return <Navigate to="/page-password" replace />;
    } else {
      return <UnlockPage />;
    }
  }

  return <Home />;
}

function App() {
  const clientConnected = useSelector((state) => state.ftp.clientConnected);

  return (
    <HashRouter>
      <div style={{ height: "100vh" }}>
        <GlobalSyncBanner visible={clientConnected} />
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/page-password" element={<PagePassword/>} />
          <Route path="/register-password" element={<RegisterPassword/>} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
