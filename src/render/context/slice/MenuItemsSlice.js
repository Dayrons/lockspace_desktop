import { createSlice } from "@reduxjs/toolkit";


export const MenuItemsSlice = createSlice({
  name: "menu-items",
  initialState: {
    isOpen: false,
  },
  reducers: {
    open: (state, action) => {
      state.isOpen = !state.isOpen;
     
    },

  },
});

export const { open } = MenuItemsSlice.actions;

export default MenuItemsSlice.reducer;
