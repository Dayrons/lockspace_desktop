import { createSlice } from "@reduxjs/toolkit";
import { getItem } from "../../utils/function";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: getItem({ str: "user" }),
    masterPassword: null, // Contraseña maestra en memoria (no se guarda en localStorage)
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setMasterPassword: (state, action) => {
      state.masterPassword = action.payload;
    },
    clearMasterPassword: (state) => {
      state.masterPassword = null;
    },
  },
});

export const { setUser, setMasterPassword, clearMasterPassword } =
  userSlice.actions;

export default userSlice.reducer;
