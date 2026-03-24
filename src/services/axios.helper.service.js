import axios from "axios";

/*--------------------------------------------------- */
/*                    Base Config                     */
/*--------------------------------------------------- */

export const BASE_URL = "https://website-api.ragory.tech/api/v1";

 const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW1pMGlsb3cwMDAwb2R4OHJwOGNrZjF2IiwidHlwZSI6IkFETUlOIiwiZGV2aWNlSWQiOiJjbW1pMGptNTEwMDAxczcycG85Y2w0Y3M5Iiwicm9sZSI6IlNVUEVSQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTc3MzQ2MDE4OSwiZXhwIjoxNzc0MzYwMTg5fQ.3-6cau2lXbzaQ9ejKIMdowhxhHFnXOFdQRwgcuwoJ1E";

if (typeof window !== "undefined") {
  localStorage.setItem("token", TOKEN);
}
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

// api.interceptors.request.use(
//   (config) => {
//     if (TOKEN) {
//       config.headers.Authorization = `Bearer ${TOKEN}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);