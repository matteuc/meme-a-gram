import 'dotenv/config'
import { MercuriusAuthPolicy } from 'mercurius-auth'

export const MEME_PAGE_SIZE = 15

export const ERROR_CODES = {
  MEME_REF_INVALID: {
    message: 'Invalid Meme imageRef.',
    code: 'MEME_REF_INVALID',
  },
  NOT_AUTH: {
    message: 'User not authenticated.',
    code: 'NOT_AUTH',
  },
}

export const BUCKET_FOLDERS = {
  users: 'users',
}

export const CONFIG = {
  server_port: process.env.PORT,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_bucket_name: process.env.S3_BUCKET_NAME,
  aws_bucket_region: process.env.S3_BUCKET_REGION,
  aws_cognito_pool_region: process.env.COGNITO_USER_POOL_REGION,
  aws_cognito_pool_id: process.env.COGNITO_USER_POOL_ID,
}

export const DEPLOYED_TO_PORT = CONFIG.server_port || 4000

export const AUTH_OBJECT_POLICY: MercuriusAuthPolicy = {
  Query: {
    feed: { public: true },
    memeById: { public: true },
    getFileUploadUrl: { public: false },
  },
  Mutation: {
    signupUser: { public: true },
    createMeme: { public: false },
  },
}
