import { createSlice } from '@reduxjs/toolkit'
import { getItem } from '../../utils/function'



export const appSlice = createSlice({
  name: 'app',
  initialState:{
    passwords:getItem({str:"passwords"}),
    
  },
  reducers: {
    setPasswords:(state,action)=>{
      state.passwords = action.payload
      localStorage.setItem("passwords",JSON.stringify(action.payload))

    },
    
  },
})


export const {setPasswords} = appSlice.actions

export default appSlice.reducer