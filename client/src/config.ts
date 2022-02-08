type AppConfig = {
  COGNITO_POOL_ID: string;
  COGNITO_POOL_CLIENT_ID: string;
  API_BASE_URI: string;
};

export const APP_TITLE = "meme-oir ✨";

export const appConfig: AppConfig = {
  COGNITO_POOL_ID: process.env.REACT_APP_COGNITO_POOL_ID as string,
  COGNITO_POOL_CLIENT_ID: process.env.REACT_APP_COGNITO_POOL_CLIENT_ID as string,
  API_BASE_URI: process.env.REACT_APP_API_BASE_URI as string
};
