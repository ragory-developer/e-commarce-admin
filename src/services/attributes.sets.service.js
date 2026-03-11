import axios from "axios";
import {TOKEN} from "./bearer.token"
import { BASE_URL } from "./bearer.token";
/*--------------------------------------------------- */
/*              Get Product Attribute Sets API                  */
/*--------------------------------------------------- */
export const getProductAttributeSetsRequest = async (params = {}) => {
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const response = await axios.get(`${BASE_URL}/api/v1/attribute-sets`, {
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
/*              Create Product Attribute Sets API               */
/*--------------------------------------------------- */
export const createProductAttributeSetsRequest = async ({ postBody }) => {
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const response = await axios.post(
      `${BASE_URL}/api/v1/attribute-sets`,
      postBody,
      {
        headers,
      },
    );

    // Assuming success is indicated by response.data.success
    if (response.data?.success) {
      return response.data;
    } else {
      // If success flag is missing but request succeeded, return data
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error creating tags:",
      error.response?.data || error.message,
    );
  }
};
