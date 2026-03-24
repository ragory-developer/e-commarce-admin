import { api, handleApiError } from "./axios.helper.service";

/*--------------------------------------------------- */
/*         Get Product Attribute Sets API             */
/*--------------------------------------------------- */

export const getProductAttributeSetsRequest = async (skip = 0, take = 20) => {
  try {
    const response = await api.get("/attribute-sets", {
      params: { skip, take },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/*--------------------------------------------------- */
/*         Create Product Attribute Set API           */
/*--------------------------------------------------- */

export const createProductAttributeSetRequest = async (postBody) => {
  try {
    const response = await api.post("/attribute-sets", postBody);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
