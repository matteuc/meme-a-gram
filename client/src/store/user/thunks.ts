import { upsertUser } from ".";
import { AppDispatch } from "..";
import { ApiDepot } from "../../services";

const createUser =
  (dispatch: AppDispatch) =>
  async (
    ...params: Parameters<typeof ApiDepot.mutations.createUser>
  ): Promise<User> => {
    const newlyCreatedUser = await ApiDepot.mutations.createUser(...params);

    const user: User = {
      id: newlyCreatedUser.id,
      username: newlyCreatedUser.username,
    };

    dispatch(upsertUser(user));

    return user;
  };

const getCurrentUser = (dispatch: AppDispatch) => async (): Promise<User> => {
  const currUser = await ApiDepot.queries.getCurrentUser();

  if (!currUser) {
    throw new Error("No user returned from get user request.");
  }

  const user: User = {
    id: currUser.id,
    username: currUser.username,
  };

  dispatch(upsertUser(user));

  return user;
};

export { createUser, getCurrentUser };
