import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const memeAdapter = createEntityAdapter<Meme>({
  selectId: (meme) => meme.id,
});

const initialState = memeAdapter.getInitialState();

export const memeSlice = createSlice({
  name: "meme",
  initialState,
  reducers: {
    upsertMeme: (state, action: PayloadAction<Meme>) => {
      memeAdapter.upsertOne(state, action.payload);
    },
    upsertMemes: (state, action: PayloadAction<Meme[]>) => {
      memeAdapter.upsertMany(state, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { upsertMeme, upsertMemes } = memeSlice.actions;

export default memeSlice.reducer;
