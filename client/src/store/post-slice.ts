import { createSlice } from '@reduxjs/toolkit';

export type Post = {
  _id: string;
  creator: { username: string };
  content: string;
  image: { url: string | null };
  createdAt: string;
};

export type PostState = {
  posts: Post[];
  totalPosts: null | number;
  loading: boolean;
  error: null | string;
  hasMore: boolean;
};

const initialState: PostState = {
  posts: [],
  totalPosts: null,
  loading: false,
  error: null,
  hasMore: true,
};

const postSlice = createSlice({
  name: 'posts',
  initialState: initialState,
  reducers: {
    updatePosts(state, action) {
      state.posts = action.payload.posts;
      state.hasMore = action.payload.hasMore;
      state.totalPosts = action.payload.totalPosts;
    },
    addPost(state, action) {
      state.posts.unshift(action.payload);
    },
    deletePost(state, action) {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
  },
});

export const postActions = postSlice.actions;

export default postSlice;
