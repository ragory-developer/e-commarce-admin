import axios from "axios";

const BASE_URL = "https://ecommarce-production.up.railway.app";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWx5dHhhZDAwMDAwb2RoazR1d2N4ZG05IiwiZW1haWwiOiJzdXBlcmFkbWluQGNvbXBhbnkuY29tIiwidXNlclR5cGUiOiJBRE1JTiIsInJvbGUiOiJTVVBFUkFETUlOIiwicGVybWlzc2lvbnMiOlsiTUFOQUdFX1VTRVJTIiwiVklFV19VU0VSUyIsIk1BTkFHRV9QUk9EVUNUUyIsIlZJRVdfUFJPRFVDVFMiLCJNQU5BR0VfT1JERVJTIiwiVklFV19PUkRFUlMiLCJNQU5BR0VfUEFZTUVOVFMiLCJWSUVXX1BBWU1FTlRTIiwiVklFV19SRVBPUlRTIiwiRVhQT1JUX0RBVEEiLCJNQU5BR0VfU0VUVElOR1MiXSwiaWF0IjoxNzcxOTE1NTYwLCJleHAiOjE3NzI1MjAzNjB9.pKtztn1CqSXz3iJEOvp_hh8ha-Ph9MqWHpj0NIdSNjk";

/*--------------------------------------------------- */
/*              Get Product Attribute Sets API                  */
/*--------------------------------------------------- */
export const getProductAttributeSetsRequest = async (params = {}) => {
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const response = await axios.get(`${BASE_URL}/api/v1/attributes/sets`, {
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
      `${BASE_URL}/api/v1/attributes/sets`,
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
