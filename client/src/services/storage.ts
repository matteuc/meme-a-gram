import { getFileUploadUrl } from "./api/queries";

export const uploadFileToStorage = async (file: File) => {
  const urlRes = await getFileUploadUrl(file);

  await fetch(urlRes.url, {
    method: "PUT",
    body: file,
  });

  return urlRes.key;
};
