import { configureStore } from '@reduxjs/toolkit';
import postSlice from './post-slice';
import userSlice from './user-slice';

export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: { postsState: postSlice.reducer, userState: userSlice.reducer },
});

export default store;
