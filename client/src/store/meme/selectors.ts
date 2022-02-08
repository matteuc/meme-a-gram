import { RootState } from "..";

export const getMeme = (state: RootState, memeId: number) => {
  return state.memes.entities[memeId];
};

export const getFeed = (state: RootState) => {
  return Object.values(state.memes.entities).filter(e => e) as Meme[];
};
