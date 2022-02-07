type AppConfig = {
  COGNITO_POOL_ID: string;
  COGNITO_POOL_CLIENT_ID: string;
};

export const appConfig: AppConfig = {
  COGNITO_POOL_ID: process.env.REACT_APP_COGNITO_POOL_ID as string,
  COGNITO_POOL_CLIENT_ID: process.env.REACT_APP_COGNITO_POOL_CLIENT_ID as string,
};
