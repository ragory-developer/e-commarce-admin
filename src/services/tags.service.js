import { api, handleApiError } from "./axios.helper.service";

/*--------------------------------------------------- */
/*              Get Product Tags API                  */
/*--------------------------------------------------- */
export const getProductTagsRequest = async () => {
  try {
    const response = await api.get("/tags");

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/*--------------------------------------------------- */
/*              Create Product Tags API               */
/*--------------------------------------------------- */
export const createProductTagsRequest = async (postBody) => {
  try {
    const response = await api.post("/tags", postBody);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};
