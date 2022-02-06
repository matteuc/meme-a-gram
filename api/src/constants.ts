import 'dotenv/config'

export const MEME_PAGE_SIZE = 15

export const ERROR_CODES = {
  MEME_REF_INVALID: {
    message: 'Invalid Meme imageRef.',
    code: 'MEME_REF_INVALID',
  },
}

export const CONFIG = {
  server_port: process.env.PORT,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_bucket_name: process.env.S3_BUCKET_NAME,
  aws_bucket_region: process.env.S3_BUCKET_REGION
}