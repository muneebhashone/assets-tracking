import { AxiosError } from "axios";

export type ErrorResponseType = AxiosError<{
  status: "error" | string;
  message: string;
  payload?: Record<any, any>;
}>;

export type SuccessResponseType = {
  status: "success" | string;
  message: string;
  data?: Record<any, any>;
};
