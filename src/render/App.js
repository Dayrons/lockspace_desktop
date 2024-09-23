import React from 'react'
import { HashRouter, Route, Routes } from "react-router-dom"
import './App.scss'
import { Home } from './pages/Home'
import { PagePassword } from './pages/PagePasswords'
import { RegisterPassword } from './pages/RegisterPassword'




function App() {
   

    return (

        <HashRouter>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/page-password" element={<PagePassword/>} />
          <Route path="/register-password" element={<RegisterPassword/>} />
        </Routes>

      </HashRouter>

    )
}

export default App
