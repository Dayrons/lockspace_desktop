import React from 'react'
import { Password } from './Password'

export  function ListPassword() {
  return (
    <div style={{
        width:"80%",
        margin:"auto",
        marginTop:"20px"
    }}>

        {[1,2,3,4,5,6,7,8,9,0].map(password=><Password password={password}/>)}
    </div>
  )
}
