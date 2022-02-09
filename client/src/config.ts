type AppConfig = {
  COGNITO_POOL_ID: string;
  COGNITO_POOL_CLIENT_ID: string;
  API_BASE_URI: string;
};

export const APP_TITLE = "meme-oir ✨";

export const MIN_USERNAME_LENGTH = 5;

export const PASSWORD_REQ_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).{8,}$/

export const EMAIL_REQ_REGEX = /^\w+([.+-]?\w+)*@\w+([.+-]?\w+)*(\.\w{2,3})+$/

export const appConfig: AppConfig = {
  COGNITO_POOL_ID: process.env.REACT_APP_COGNITO_POOL_ID as string,
  COGNITO_POOL_CLIENT_ID: process.env.REACT_APP_COGNITO_POOL_CLIENT_ID as string,
  API_BASE_URI: process.env.REACT_APP_API_BASE_URI as string
};
