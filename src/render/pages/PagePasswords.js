import React from 'react'
import { Navbar } from '../components/Navbar'
import { ListPassword } from '../components/ListPassword'
import { MenuItems } from '../components/MenuItems'


export  function PagePassword() {
  return (
    <div>
      <Navbar/>
      <MenuItems/>
      <ListPassword/>
    </div>
  )
}


