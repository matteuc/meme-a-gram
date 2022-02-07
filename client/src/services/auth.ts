import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { appConfig } from "../config";

interface LoginUsingCredentialsResult {
  idToken: string;
  refreshToken: string;
  idTokenExpiresAt: number;
}

interface SignUpResult extends LoginUsingCredentialsResult {}

const COGNITO_USER_POOL_CONFIG = {
  UserPoolId: appConfig.COGNITO_POOL_ID, // Your user pool id here
  ClientId: appConfig.COGNITO_POOL_CLIENT_ID, // Your client id here
};

const COGNITO_USER_POOL = new CognitoUserPool(COGNITO_USER_POOL_CONFIG);

class AuthService {
  pool: CognitoUserPool;

  constructor(pool: CognitoUserPool) {
    this.pool = pool;
  }

  loginUsingCredentials = async (
    email: string,
    password: string
  ): Promise<LoginUsingCredentialsResult> => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.pool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(
        new AuthenticationDetails({
          Username: email,
          Password: password,
        }),
        {
          onSuccess: function (result) {
            const loginResult: LoginUsingCredentialsResult = {
              refreshToken: result.getRefreshToken().getToken(),
              idToken: result.getAccessToken().getJwtToken(),
              idTokenExpiresAt: result.getAccessToken().getExpiration(),
            };

            resolve(loginResult);
          },
          onFailure: function (err) {
            reject(err);
          },
        }
      );
    });
  };

  signUp = async (email: string, password: string): Promise<SignUpResult> => {
    const attributeList: CognitoUserAttribute[] = [];

    const dataEmail = {
      Name: "email",
      Value: email,
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    return new Promise((resolve, reject) => {
      this.pool.signUp(
        email,
        password,
        attributeList,
        [],
        function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          if (!result) {
            reject(new Error("There was an error creating the account."));
            return;
          }
          const cognitoUser = result.user;

          cognitoUser.getSession(function (
            err: Error | null,
            session: CognitoUserSession
          ) {
            if (err) {
              reject(err);
              return;
            }

            const signupResult: SignUpResult = {
              refreshToken: session.getRefreshToken().getToken(),
              idToken: session.getAccessToken().getJwtToken(),
              idTokenExpiresAt: session.getAccessToken().getExpiration(),
            };

            resolve(signupResult);
          });
        }
      );
    });
  };

  confirmAccountUsingCode = async (user: CognitoUser, code: string) => {
    return new Promise((resolve, reject) => {
      user.confirmRegistration(code, true, function (err, result) {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  };
}

export const authService = new AuthService(COGNITO_USER_POOL);
