import { baseFetch } from "./baseFetch";

interface GetFileUploadUrlResponse {
  getFileUploadUrl: {
    url: string;
    key: string;
  };
}

export const getFileUploadUrl = async (file: File) => {
  const payload = {
    fileName: file.name,
    fileType: file.type,
  };

  const { getFileUploadUrl: url } =
    await baseFetch.postQuery<GetFileUploadUrlResponse>(
      `query GET_FILE($fileName: String!, $fileType: String!) {
            getFileUploadUrl(data: { 
                fileName: $fileName, 
                fileType: $fileType 
            }) {
              url
              key
            }
        }`,
      "GET_FILE",
      payload
    );

  return url;
};

interface GetFeedResponse {
  feed: Array<{
    id: number;
    createdAt: number;
    author: {
      id: number;
      username: string;
    };
    title: string;
    imageUrl: string;
  }>;
}

export const getFeed = async (lastId?: number, searchString?: string) => {
  const payload: { lastId?: number; searchString?: string } = {};

  if (lastId) payload["lastId"] = lastId;
  if (searchString) payload["searchString"] = searchString;

  const { feed: feedItems } = await baseFetch.postQuery<GetFeedResponse>(
    `query GET_FEED($lastId: Int, $searchString: String) {
        feed(lastId: $lastId, searchString: $searchString) {
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
    "GET_FEED",
    payload
  );

  return feedItems;
};

interface GetMemeResponse {
  memeById: {
    id: number;
    createdAt: number;
    author: {
      id: number;
      username: string;
    };
    title: string;
    imageUrl: string;
  } | null;
}

export const getMeme = async (memeId: number) => {
  const payload = { id: memeId };

  const { memeById } = await baseFetch.postQuery<GetMemeResponse>(
    `query GET_MEME($id: Int!) {
        memeById(id: $id) {
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
    "GET_MEME",
    payload
  );

  return memeById;
};

interface GetCurrentUserResponse {
  getCurrentUser: {
    id: number;
    username: string;
    email: string;
  };
}

export const getCurrentUser = async () => {
  const { getCurrentUser } = await baseFetch.postQuery<GetCurrentUserResponse>(
    `query GET_CURR_USER() {
        getCurrentUser {
            id
            email
            username
        }
    }`,
    "GET_CURR_USER"
  );

  return getCurrentUser;
};
