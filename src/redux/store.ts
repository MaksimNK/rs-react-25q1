import { configureStore } from '@reduxjs/toolkit';
import selectedItemReducer from './selectItemSlice';

const store = configureStore({
  reducer: {
    selectedItem: selectedItemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
