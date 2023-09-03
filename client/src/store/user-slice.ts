import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Post } from './post-slice';

export type UserState = {
  _id: null | string;
  username: null | string;
  email: null | string;
  image: { url: string | null };
  posts: Post[];
};

const initialState: UserState = {
  _id: null,
  username: null,
  email: null,
  image: { url: null },
  posts: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    setUserPosts: (state, action: PayloadAction<UserState>) => {
      state.posts = action.payload.posts;
    },
    addPost(state, action) {
      state.posts.unshift(action.payload);
    },
    deletePost(state, action) {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    clearUser: (state) => {
      state._id = null;
      state.username = null;
      state.email = null;
      state.posts = [];
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
