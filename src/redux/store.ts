import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './slices/countriesSlice';
import formReducer from './slices/formSlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    countries: countriesReducer,
  },
});
export default store;
export type AppRootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
