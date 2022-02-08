import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
});

const initialState = userAdapter.getInitialState();

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    upsertUser: (state, action: PayloadAction<User>) => {
      userAdapter.upsertOne(state, action.payload);
    },
    upsertUsers: (state, action: PayloadAction<User[]>) => {
      userAdapter.upsertMany(state, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { upsertUser, upsertUsers } = userSlice.actions;

export default userSlice.reducer;
