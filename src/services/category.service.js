import axios from "axios";
import { toast } from "react-toastify";

import {TOKEN} from "./bearer.token"
import { BASE_URL } from "./bearer.token";
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
