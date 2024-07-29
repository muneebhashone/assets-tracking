import axios, { AxiosError, HttpStatusCode } from "axios";
import { AUTH_KEY } from "./constants";

export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

apiAxios.interceptors.request.use((config) => {
  try {
    if (typeof localStorage.getItem(AUTH_KEY) === "string") {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        AUTH_KEY,
      )}`;
    }
  } catch {}

  return config;
});

apiAxios.interceptors.response.use(
  (response) => response,
  (err: AxiosError) => {
    if ("response" in err && err.response) {
      if ("status" in err.response) {
        if (err.response.status >= 400) {
          throw err;
        }

        if (err.response?.status === HttpStatusCode.Unauthorized) {
          try {
            localStorage.removeItem(AUTH_KEY);
          } catch {}

          return err.response;
        }
      }
    }

    return err;
  },
);

export const searatesApiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEARATES_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_SEARATES_API_KEY,
  },
});
