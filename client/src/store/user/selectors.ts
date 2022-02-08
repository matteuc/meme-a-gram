import { RootState } from "..";

export const getUser = (state: RootState, userId: number) => {
  return state.users.entities[userId];
};
