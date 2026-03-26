import { api, handleApiError } from "./axios.helper.service";

/*--------------------------------------------------- */
/*         Get All Media Request  API                 */
/*--------------------------------------------------- */
export const getAllMediaRequest = async (
  skip = 0,
  take = 20,
  mimeType = "image",
  storageDriver = "cloudinary",
) => {
  try {
    const response = await api.get("/media", {
      params: {
        skip,
        take,
        mimeType,
        storageDriver,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
/*--------------------------------------------------- */
/*         Upload Single Media Request API            */
/*--------------------------------------------------- */

export const uploadSingleMediaRequest = async (postBody) => {
  try {
    const response = await api.post("/media/upload", postBody);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/*--------------------------------------------------- */
/*         Upload Multiple Media Request API          */
/*--------------------------------------------------- */

export const uploadMultipleMediaRequest = async (postBody) => {
  try {
    const response = await api.post("/media/upload-multiple", postBody);

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

/*--------------------------------------------------- */
/*         Link Media to Entity Request API           */
/*--------------------------------------------------- */
// Creates entity_media records and increments media reference counts
export const createEntityMediaRequest = async (postBody) => {
  try {
    const response = await api.post("/media/link", postBody);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/*--------------------------------------------------- */
/*         Update Media to Entity Request API         */
/*--------------------------------------------------- */
// Replaces existing links, updates reference counts, and sets main image
export const replaceEntityMediaRequest = async (postBody) => {
  try {
    const response = await api.patch("/media/link", postBody);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
