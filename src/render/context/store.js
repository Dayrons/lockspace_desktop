import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AppReducer from "./slice/AppSlice";
import UserReducer from "./slice/UserSlice";
import MenuItemsReducer from "./slice/MenuItemsSlice";
import FtpReducer from "./slice/FtpSlice";

const rootReducer = combineReducers({
  app: AppReducer,
  user: UserReducer,
  menuItems: MenuItemsReducer,
  ftp: FtpReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});
