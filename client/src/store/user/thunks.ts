import { upsertUser } from ".";
import { AppDispatch } from "..";
import { ApiDepot } from "../../services";

const createUser =
  (dispatch: AppDispatch) =>
  async (
    params: Parameters<typeof ApiDepot.mutations.createUser>
  ): Promise<User> => {
    const newlyCreatedUser = await ApiDepot.mutations.createUser(...params);

    const user: User = {
      id: newlyCreatedUser.id,
      username: newlyCreatedUser.username,
    };

    dispatch(upsertUser(user));

    return user;
  };

export { createUser };
