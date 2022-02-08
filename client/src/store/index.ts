import { configureStore } from "@reduxjs/toolkit";
import memeReducer from "./meme";
import userReducer from "./user";
import * as memeThunks from "./meme/thunks"
import * as userThunks from "./user/thunks"
import * as memeSelectors from "./meme/selectors"
import * as userSelectors from "./user/selectors"

export const AppThunks = {
    memes: memeThunks,
    users: userThunks
}

export const AppSelectors = {
    memes: memeSelectors,
    users: userSelectors
}

export const store = configureStore({
  reducer: {
    memes: memeReducer,
    users: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
