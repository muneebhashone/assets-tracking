import axios from "axios";

export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
});

export const searatesApiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEARATES_URL,
});

searatesApiAxios.interceptors.request.use(
  (config) => {
    config.url = config.url?.includes("?")
      ? config.url + `&api_key=${process.env.SEARATES_API_KEY}`
      : `?api_key=${process.env.SEARATES_API_KEY}`;

    return config;
  },
  (error) => Promise.reject(error),
);
