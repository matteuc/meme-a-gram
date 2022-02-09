import { MAIN_STORAGE_BUCKET } from '../services'

// Get image URL based off image reference
export const getImageUrlFromImageRef = async (
  imageRef: string,
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

  const getViewUrl = `https://${MAIN_STORAGE_BUCKET.name}.s3.${MAIN_STORAGE_BUCKET.region}.amazonaws.com/${imageRef}`

  return getViewUrl
}

export const getStorageBucketUploadUrl = async (
  folderId: string,
  fileName: string,
  fileType: string,
  folderPath: string,
) => {
  const newFileName = `${(Date.now() / 1000).toFixed(0)}_${fileName}`

  const objectKey = `${folderPath}/${folderId}/${newFileName}`

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
