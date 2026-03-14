import { api, handleApiError } from "./axios.helper.service";

/*--------------------------------------------------- */
/*              Get Product Tags API                  */
/*--------------------------------------------------- */
export const getProductTagsRequest = async () => {
  try {
    const response = await api.get("/api/v1/tags");

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
    const response = await api.post("/api/v1/tags", postBody);
    return;
  } catch (error) {
    handleApiError(error);
  }
};
