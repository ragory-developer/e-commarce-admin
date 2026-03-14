import axios from "axios";

/*--------------------------------------------------- */
/*                    Base Config                     */
/*--------------------------------------------------- */

export const BASE_URL = "https://website-api.ragory.tech/";

export const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW1sbzlnejcwMDA3cXgyYXJhY3hrendvIiwidHlwZSI6IkFETUlOIiwiZGV2aWNlSWQiOiJjbW1uOGN6enYwMDAxbnoyYTVsYWxnZWF3Iiwicm9sZSI6IlNVUEVSQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTc3MzMwNTU4NywiZXhwIjoxNzc0MjA1NTg3fQ.WQeC9DMlGl4PgiNFmQCoCqQOJ0USuMQ32sSwldbomCg";

/*--------------------------------------------------- */
/*                Axios Instance                      */
/*--------------------------------------------------- */

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

/*--------------------------------------------------- */
/*            Add Token Automatically                 */
/*--------------------------------------------------- */

api.interceptors.request.use(
  (config) => {
    if (TOKEN) {
      config.headers.Authorization = `Bearer ${TOKEN}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*--------------------------------------------------- */
/*                Error Handler                       */
/*--------------------------------------------------- */

export const handleApiError = (error) => {
  if (error.response) {
    throw {
      status: error.response.status,
      message: error.response.data?.message || "Server Error",
      data: error.response.data,
    };
  }

  if (error.request) {
    throw {
      status: 0,
      message: "Network error. Please check your internet connection.",
    };
  }

  throw {
    status: 0,
    message: error.message || "Unexpected error occurred",
  };
};

/*--------------------------------------------------- */
/*        Request Interceptor (Future Token Use)     */
/*--------------------------------------------------- */
/*
  This interceptor automatically attaches the auth token
  to every API request.

  When authentication is implemented, store the token in
  localStorage and uncomment this block.
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("TOKEN");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
