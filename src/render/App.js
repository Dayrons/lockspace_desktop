import React, { useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import './App.scss'
import { Home } from './pages/Home'
import { PagePassword } from './pages/PagePasswords'
import { RegisterPassword } from './pages/RegisterPassword'
import { SignupPage } from './pages/SignupPage'
import { UnlockPage } from './pages/UnlockPage'
import { SyncBanner } from './components/SyncBanner'
import { useSelector, useDispatch } from 'react-redux'
import { setClientConnected } from './context/slice/FtpSlice'
const { ipcRenderer } = require("electron");

/**
 * Banner global de conexión: escucha IPC del main process en el nivel raíz
 * para que el banner aparezca en cualquier página (Home, UnlockPage, etc.)
 */
function GlobalSyncBanner() {
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

  return <SyncBanner />;
}

/**
 * Ruta raíz: decide qué mostrar al iniciar la app.
 * - Si hay user en localStorage Y masterPassword en memoria → ir a contraseñas
 * - Si hay user PERO no masterPassword → mostrar pantalla de desbloqueo
 * - Si no hay user → mostrar login/QR
 */
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
    return (
        <HashRouter>
        <GlobalSyncBanner />
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/page-password" element={<PagePassword/>} />
          <Route path="/register-password" element={<RegisterPassword/>} />
        </Routes>
      </HashRouter>
    )
}

export default App
