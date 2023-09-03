import { configureStore } from '@reduxjs/toolkit';
import postSlice from './post-slice';

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: postSlice.reducer,
});

export default store;
