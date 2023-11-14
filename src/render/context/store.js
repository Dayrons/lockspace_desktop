import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AppReducer from './slice/AppSlice'



const rootReducer = combineReducers({
	app:AppReducer
})


export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(

		),
})