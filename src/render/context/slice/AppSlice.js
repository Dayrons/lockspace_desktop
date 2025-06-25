import { createSlice } from "@reduxjs/toolkit";
import { getItem } from "../../utils/function";
const { ipcRenderer } = require('electron')


export const appSlice = createSlice({
  name: "app",
  initialState: {
    passwords: [],
  },
  reducers: {
    setPasswords: (state, action) => {
      state.passwords = action.payload;
      localStorage.setItem("passwords", JSON.stringify(action.payload));
    },

    getPasswords: async(state, action)=>{
        const user = getItem({str:"user"})
        let res = await ipcRenderer.invoke('get-password', user)
        res = JSON.parse(res)
        console.log(res)
        state.passwords = res.data 

    },

    filterPasswords: (state, action) => {
      const text = action.payload;

      const passwords = getItem({ str: "passwords" });
      const regex = new RegExp(text, "gi");

      state.passwords = passwords.filter((password) =>
        regex.test(password.titulo)
      );
    },

    clearPasswords: (state, action) => {
      state.passwords = null;
      localStorage.removeItem("passwords");
    },

    registerPassword: async (state, action) => {
      
      try {
        await ipcRenderer.invoke('register-password', action.payload)
      
        console.log(response)
      } catch (error) {
        console.log(error)
      }
      

    

      
   
    },
  },
});

export const { setPasswords, getPasswords ,filterPasswords, clearPasswords, registerPassword} =
  appSlice.actions;

export default appSlice.reducer;
