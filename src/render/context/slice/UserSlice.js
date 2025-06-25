import { createSlice } from "@reduxjs/toolkit";
import { getItem } from "../../utils/function";


export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: getItem({ str: "user" }),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

  },
});

export const {setUser} =
  userSlice.actions;

export default userSlice.reducer;
