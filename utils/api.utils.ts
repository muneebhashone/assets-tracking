import axios, { AxiosError, HttpStatusCode } from "axios";
import { AUTH_KEY } from "./constants";
import { queryClient } from "@/components/ReactQueryClientProvider";
import { currentUser } from "@/services/auth.mutations";

export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
});

apiAxios.interceptors.request.use((config) => {
  if (typeof localStorage.getItem(AUTH_KEY) === "string") {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem(
      AUTH_KEY,
    )}`;
  }

  return config;
});

apiAxios.interceptors.response.use(
  (response) => response,
  (err: AxiosError) => {
    console.log(err.response?.status);
    if (err.response?.status === HttpStatusCode.Unauthorized) {
      localStorage.removeItem(AUTH_KEY);
      queryClient.removeQueries({ queryKey: [currentUser.name] });
      // window.location.replace("/signin");
      return err.response;
    }

    return err.response;
  },
);

export const searatesApiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEARATES_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_SEARATES_API_KEY,
  },
});

// searatesApiAxios.interceptors.request.use(
//   (config) => {
//     config.url = config.url?.includes("?")
//       ? config.url + `&api_key=${process.env.NEXT_PUBLIC_SEARATES_API_KEY}`
//       : config.url + `?api_key=${process.env.NEXT_PUBLIC_SEARATES_API_KEY}`;

//     return config;
//   },
//   (error) => Promise.reject(error),
// );
