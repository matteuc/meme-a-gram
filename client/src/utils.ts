import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { COGNITO_USER_POOL } from "./services";

interface LoginUsingCredentialsResult {
  idToken: string;
  refreshToken: string;
  idTokenExpiresAt: number;
}

interface SignUpResult extends LoginUsingCredentialsResult {}

export const loginUsingCredentials = async (
  email: string,
  password: string
): Promise<LoginUsingCredentialsResult> => {
  var cognitoUser = new CognitoUser({
    Username: email,
    Pool: COGNITO_USER_POOL,
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

export const signUp = async (
  email: string,
  password: string
): Promise<SignUpResult> => {
  const attributeList: CognitoUserAttribute[] = [];

  const dataEmail = {
    Name: "email",
    Value: email,
  };

  const attributeEmail = new CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);

  return new Promise((resolve, reject) => {
    COGNITO_USER_POOL.signUp(email, password, attributeList, [], function (err, result) {
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
    });
  });
};

export const confirmAccountUsingCode = async (
  user: CognitoUser,
  code: string
) => {
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
