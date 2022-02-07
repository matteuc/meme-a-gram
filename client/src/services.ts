import { CognitoUserPool } from "amazon-cognito-identity-js";
import { appConfig } from "./config";

const COGNITO_USER_POOL_CONFIG = {
  UserPoolId: appConfig.COGNITO_POOL_ID, // Your user pool id here
  ClientId: appConfig.COGNITO_POOL_CLIENT_ID, // Your client id here
};

export const COGNITO_USER_POOL = new CognitoUserPool(COGNITO_USER_POOL_CONFIG);
