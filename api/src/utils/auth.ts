import { CognitoIdentityServiceProvider } from "aws-sdk"
import jwt, { JwtPayload } from "jsonwebtoken"
import jwkToPem from "jwk-to-pem"
import jwt_decode from 'jwt-decode'
import { context } from "../context"
import { MAIN_USER_POOL } from "../services"
import { AuthContext } from "../types"

const JWK = require('../../jwk.json')

export const getUserFromToken = async (
    token: string,
  ): Promise<AuthContext | null> => {
    const keys = JWK['keys'] || []
  
    const decodedHeader = jwt_decode(token, { header: true }) as any
  
    const matchingKey = keys.find((key: any) => key.kid === decodedHeader.kid)
  
    if (!matchingKey) {
      throw new Error('Kid claim is invalid.')
    }
  
    const pem = jwkToPem(matchingKey)
  
    const decodedToken = (await new Promise((resolve, reject) => {
      jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err, resToken) {
        if (err) {
          reject(err)
          return
        }
  
        resolve(resToken as JwtPayload)
      })
    })) as JwtPayload
  
    const now = new Date().getTime() / 1000
  
    const expiryTime = decodedToken.exp || 0
  
    if (expiryTime < now) {
      throw new Error('Token has expired.')
    }
  
    const authContext: AuthContext = {}
  
    const userData =
      await new Promise<CognitoIdentityServiceProvider.GetUserResponse>(
        (resolve, reject) => {
          MAIN_USER_POOL.api.getUser({ AccessToken: token }, (err, data) => {
            if (err) {
              reject(err)
              return
            }
  
            resolve(data)
          })
        },
      )
  
    const userEmail = userData.UserAttributes.find(
      (attr) => attr.Name === 'email',
    )?.Value
  
    if (!userEmail) {
      throw new Error('User data is missing the key "email".')
    }

    authContext.userEmail = userEmail;
  
    if (decodedToken.username) {
      authContext.userAuthId = decodedToken.username as string;
    }
  
    const userRes = await context.prisma.user.findUnique({
      where: { email: userEmail },
    })
  
    if (userRes) {
      authContext.user = userRes
    }
    
    return authContext
  }
  