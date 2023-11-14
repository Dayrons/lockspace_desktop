import React from 'react'
import { Password } from './Password'
import { useSelector } from 'react-redux'
export  function ListPassword() {
  const state = useSelector(state => state.app)
  return (
    <div style={{
        width:"80%",
        margin:"auto",
        marginTop:"20px"
    }}>

        {state.passwords.map(password=><Password password={password}/>)}
    </div>
  )
}
