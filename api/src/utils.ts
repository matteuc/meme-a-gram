import { CognitoIdentityServiceProvider } from 'aws-sdk'
import jwt, { JwtPayload } from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import jwt_decode from 'jwt-decode'
import { context } from './context'
import { MAIN_STORAGE_BUCKET, MAIN_USER_POOL } from './services'
import { AuthContext } from './types'

const JWK = require('../jwk.json')

// Get image URL based off image reference
export const getImageUrlFromImageRef = async (
  imageRef: string,
  fileType: string,
): Promise<string | null> => {
  if (!MAIN_STORAGE_BUCKET.name || !MAIN_STORAGE_BUCKET.region) {
    throw new Error('No main storage bucket name or region provided.')
  }

  try {
    await MAIN_STORAGE_BUCKET.api
      .headObject({ Key: imageRef, Bucket: MAIN_STORAGE_BUCKET.name })
      .promise()
  } catch (err: any) {
    if (err.code === 'NotFound') {
      return null
    }
    throw err
  }

  const getViewUrl = `https://${MAIN_STORAGE_BUCKET.name}.s3.${MAIN_STORAGE_BUCKET.region}.amazonaws.com/`

  return getViewUrl
}

export const getStorageBucketUploadUrl = async (
  folderId: string,
  fileName: string,
  fileType: string,
  folderPath: string,
) => {
  const objectKey = `${folderPath}/${folderId}/${fileName}`

  const getPutUrl = await MAIN_STORAGE_BUCKET.api.getSignedUrlPromise(
    'putObject',
    {
      Key: objectKey,
      ContentType: fileType,
    },
  )

  return {
    url: getPutUrl,
    key: objectKey,
  }
}

export const getUserFromToken = async (
  token: string,
): Promise<AuthContext['user'] | null> => {
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

  const userRes = await context.prisma.user.findUnique({
    where: { email: userEmail },
  })

  if (!userRes) {
    throw new Error('User record was not found.')
  }

  return userRes
}
