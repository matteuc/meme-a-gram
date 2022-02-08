import { upsertMeme, upsertMemes } from ".";
import { AppDispatch } from "..";
import { ApiDepot } from "../../services";
import { upsertUser, upsertUsers } from "../user";

const queryMeme =
  (dispatch: AppDispatch) =>
  async ([memeId]: Parameters<
    typeof ApiDepot.queries.getMeme
  >): Promise<Meme> => {
    const getMemeResult = await ApiDepot.queries.getMeme(memeId);

    if (!getMemeResult) throw new Error(`No meme found with ID ${memeId}`);

    const meme: Meme = {
      id: getMemeResult.id,
      createdAt: getMemeResult.createdAt,
      title: getMemeResult.title,
      imageUrl: getMemeResult.imageUrl,
      authorId: getMemeResult.author.id,
    };

    const user: User = getMemeResult.author;

    dispatch(upsertMeme(meme));

    dispatch(upsertUser(user));

    return meme;
  };

const queryFeed =
  (dispatch: AppDispatch) =>
  async (
    params: Parameters<typeof ApiDepot.queries.getFeed>
  ): Promise<Meme[]> => {
    const getFeedResult = await ApiDepot.queries.getFeed(...params);

    const memes: Meme[] = [];

    const users: User[] = [];

    getFeedResult.forEach((feedResult) => {
      const meme: Meme = {
        id: feedResult.id,
        createdAt: feedResult.createdAt,
        title: feedResult.title,
        imageUrl: feedResult.imageUrl,
        authorId: feedResult.author.id,
      };

      memes.push(meme);

      const user: User = feedResult.author;

      users.push(user);
    });

    dispatch(upsertMemes(memes));

    dispatch(upsertUsers(users));

    return memes;
  };

const createMeme =
  async (dispatch: AppDispatch) =>
  async (
    params: Parameters<typeof ApiDepot.mutations.createMeme>
  ): Promise<Meme> => {
    const createMemeResult = await ApiDepot.mutations.createMeme(...params);

    const meme: Meme = {
      id: createMemeResult.id,
      createdAt: createMemeResult.createdAt,
      title: createMemeResult.title,
      authorId: createMemeResult.author.id,
      imageUrl: createMemeResult.imageUrl,
    };

    dispatch(upsertMeme(meme));

    return meme;
  };

export { queryMeme, queryFeed, createMeme };
