import { createSlice } from "@reduxjs/toolkit";

export const ftpSlice = createSlice({
  name: "ftp",
  initialState: {
    clientConnected: false, // Flutter app conectada via FTP
  },
  reducers: {
    setClientConnected: (state, action) => {
      state.clientConnected = action.payload;
    },
  },
});

export const { setClientConnected } = ftpSlice.actions;

export default ftpSlice.reducer;
