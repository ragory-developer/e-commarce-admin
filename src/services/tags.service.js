import axios from "axios";

import {TOKEN} from "./bearer.token"
import { BASE_URL } from "./bearer.token";
import { toast } from "react-toastify";

/*--------------------------------------------------- */
/*              Get Product Tags API                  */
/*--------------------------------------------------- */
export const getProductTagsRequest = async (params = {}) => {
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const response = await axios.get(`${BASE_URL}/api/v1/tags`, {
      headers,
      params, // Now params is properly passed
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching tags:",
      error.response?.data || error.message,
    );
  }
};

/*--------------------------------------------------- */
/*              Create Product Tags API              */
/*--------------------------------------------------- */

export const createProductTagsRequest = async ({ postBody }) => {
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };
    const response = await axios.post(`${BASE_URL}/api/v1/tags`, postBody, { headers });
    // Standardize response handling
   
    return response.data
  } catch (error) {
    // Enhanced error handling
    return error.message
  }
};
