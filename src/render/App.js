import React from 'react'
import { HashRouter, Route, Routes } from "react-router-dom"
import './App.scss'
import { Home } from './pages/Home'
import { PagePassword } from './pages/PagePasswords'




function App() {
   

    return (

        <HashRouter>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/page-password" element={<PagePassword/>} />
        </Routes>

      </HashRouter>

    )
}

export default App
