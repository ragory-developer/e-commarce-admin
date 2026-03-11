import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://ecommarce-production.up.railway.app";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWx5dHhhZDAwMDAwb2RoazR1d2N4ZG05IiwiZW1haWwiOiJzdXBlcmFkbWluQGNvbXBhbnkuY29tIiwidXNlclR5cGUiOiJBRE1JTiIsInJvbGUiOiJTVVBFUkFETUlOIiwicGVybWlzc2lvbnMiOlsiTUFOQUdFX1VTRVJTIiwiVklFV19VU0VSUyIsIk1BTkFHRV9QUk9EVUNUUyIsIlZJRVdfUFJPRFVDVFMiLCJNQU5BR0VfT1JERVJTIiwiVklFV19PUkRFUlMiLCJNQU5BR0VfUEFZTUVOVFMiLCJWSUVXX1BBWU1FTlRTIiwiVklFV19SRVBPUlRTIiwiRVhQT1JUX0RBVEEiLCJNQU5BR0VfU0VUVElOR1MiXSwiaWF0IjoxNzcxOTE1NTYwLCJleHAiOjE3NzI1MjAzNjB9.pKtztn1CqSXz3iJEOvp_hh8ha-Ph9MqWHpj0NIdSNjk";

/*--------------------------------------------------- */
/*              Get Category API                      */
/*--------------------------------------------------- */
export const categoryTreeAPI = async () => {
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const params = {
      level: 0,
      isActive: true,
      includeDeleted: false,
      search: "electronics",
      page: 1,
      limit: 20,
    };

    const response = await axios.get(`${BASE_URL}/api/v1/categories`, {
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data);
    throw error.response?.data || error;
  }
};

/*--------------------------------------------------- */
/*              Get Category API                      */
/*--------------------------------------------------- */
export const createCategoryTreeAPI = async ({ postBody }) => {
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const response = await axios.post(
      `${BASE_URL}/api/v1/categories`,
      postBody,
      {
        headers,
      },
    );
    if (!response.data.success) {
      toast.error(response.data.message || "Failed to create category");
    } else {
      return response.data.success;
    }
  } catch (error) {
    console.error("Error creating category:", error.response?.data);
    throw error.response?.data || error;
  }
};
