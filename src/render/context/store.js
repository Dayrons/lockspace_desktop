import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AppReducer from './slice/AppSlice'
import MenuItemsReducer from './slice/MenuItemsSlice'



const rootReducer = combineReducers({
	app:AppReducer,
	menuItems:MenuItemsReducer
})


export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(

		),
})