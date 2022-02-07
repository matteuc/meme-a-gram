import { authService } from "../auth";
import { baseFetch } from "./baseFetch";

interface CreateMemeResponse {
  createMeme: {
    id: number;
    createdAt: number;
    author: {
      id: number;
      username: string;
    };
    title: string;
    imageUrl: string;
  };
}

export const createMeme = async (data: {
  imageRef: string;
  imageType: string;
  title: string;
}) => {
  const payload = data;

  const { createMeme: newMeme } = await baseFetch.postQuery<CreateMemeResponse>(
    `mutation CREATE_MEME($imageRef: String!, $imageType: String!, $title: String!) {
        createMeme(data: { 
            imageRef: $imageRef,
            imageType: $imageType,
            title: $title
        }) {
            id
            createdAt
            author {
                id
                username
            }
            title
            imageUrl
        }
    }`,
    "CREATE_MEME",
    payload
  );

  return newMeme;
};

interface CreateUserResponse {
  signupUser: {
    email: string;
    id: number;
    username: string;
  };
}

export const createUser = async (data: { username: string }) => {
  const payload = data;

  const { signupUser: newUser } = await baseFetch.postQuery<CreateUserResponse>(
    `mutation CREATE_USER($username: String!) {
        signupUser(data: { 
            username: $username
        }) {
            email
            id
            username
          }
        }`,
    "CREATE_USER",
    payload
  );

  return newUser;
};
