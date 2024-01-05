import { createSlice } from "@reduxjs/toolkit";
import { getItem } from "../../utils/function";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    passwords: getItem({ str: "passwords" }),
  },
  reducers: {
    setPasswords: (state, action) => {
      state.passwords = action.payload;
      localStorage.setItem("passwords", JSON.stringify(action.payload));
    },

    filterPasswords: (state, action) => {
      const text = action.payload;
   
      const passwords = getItem({ str: "passwords" });
      const regex = new RegExp(text, "gi");

      state.passwords = passwords.filter((password) => regex.test(password.titulo))
     
    },
  },
});

export const { setPasswords, filterPasswords } = appSlice.actions;

export default appSlice.reducer;
