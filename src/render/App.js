import React from 'react'
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import './App.scss'
import { Home } from './pages/Home'
import { PagePassword } from './pages/PagePasswords'
import { RegisterPassword } from './pages/RegisterPassword'
import { SignupPage } from './pages/SignupPage'
import { UnlockPage } from './pages/UnlockPage'
import { useSelector } from 'react-redux'

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
      // Usuario con sesión activa en memoria
      return <Navigate to="/page-password" replace />;
    } else {
      // Usuario guardado pero key no está en memoria (reinicio)
      return <UnlockPage />;
    }
  }

  // Sin usuario: mostrar login
  return <Home />;
}

function App() {
    return (
        <HashRouter>
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
