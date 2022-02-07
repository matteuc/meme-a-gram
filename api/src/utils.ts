import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import jwt_decode from 'jwt-decode'
import { MAIN_STORAGE_BUCKET } from './services'
import { AuthContext } from './types'

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
  const keys = require('../jwk.json')['keys'] || []

  const decodedHeader = jwt_decode(token, { header: true }) as any

  const matchingKey = keys.find((key: any) => key.kid === decodedHeader.kid)

  if (!matchingKey) {
    throw new Error('Kid claim is invalid.')
  }
  
  const pem = jwkToPem(matchingKey)
  
  // TODO - Layout ground work for decoding JWT

  // const decodedToken = await new Promise((resolve, reject) => {
  //   jwt.verify(
  //     token,
  //     pem,
  //     { algorithms: ['RS256'] },
  //     function (err, decodedToken) {
  //       if (err) {
  //         reject(err)
  //         return
  //       }

  //       resolve(decodedToken)
  //     },
  //   )
  // })

  // console.log({ decodedToken })

  return {
    name: 'Anonymous',
    id: 123,
  }
}
