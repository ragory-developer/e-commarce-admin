import { api, handleApiError } from "./axios.helper.service";

/*--------------------------------------------------- */
/*              Get Category Tree API                 */
/*--------------------------------------------------- */
export const categoryTreeAPI = async () => {
  try {
    const response = await api.get("/categories");

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/*--------------------------------------------------- */
/*              Create Category API                   */
/*--------------------------------------------------- */
export const createCategoryRequest = async (postBody) => {
  try {
    const response = await api.post("/categories", postBody);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

