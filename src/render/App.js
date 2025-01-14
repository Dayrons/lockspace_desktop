import React from 'react'
import { HashRouter, Route, Routes } from "react-router-dom"
import './App.scss'
import { Home } from './pages/Home'
import { PagePassword } from './pages/PagePasswords'
import { RegisterPassword } from './pages/RegisterPassword'
import { SignupPage } from './pages/SignupPage'




function App() {
   

    return (

        <HashRouter>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/page-password" element={<PagePassword/>} />
          <Route path="/register-password" element={<RegisterPassword/>} />
        </Routes>

      </HashRouter>

    )
}

export default App
