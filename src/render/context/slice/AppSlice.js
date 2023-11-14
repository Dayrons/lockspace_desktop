import { createSlice } from '@reduxjs/toolkit'



export const appSlice = createSlice({
  name: 'app',
  initialState:{
    passwords:[],
    
  },
  reducers: {
    setPasswords:(state,action)=>{
      state.passwords = action.payload
    },
    
  },
})


export const {setPasswords} = appSlice.actions

export default appSlice.reducer