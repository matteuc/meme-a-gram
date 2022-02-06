import AWS from 'aws-sdk'
import { CONFIG } from './constants'

AWS.config.update({
  accessKeyId: CONFIG.aws_access_key_id,
  secretAccessKey: CONFIG.aws_secret_access_key,
})

export const MAIN_STORAGE_BUCKET = {
  api: new AWS.S3({
    params: {
      Bucket: CONFIG.aws_bucket_name,
      region: CONFIG.aws_bucket_region,
    },
  }),
  name: CONFIG.aws_bucket_name,
  region: CONFIG.aws_bucket_region,
}
