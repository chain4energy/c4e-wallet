import { AxiosError, AxiosResponse } from "axios";

export const accountNotFoundErrorMessage = 'rpc error: code = NotFound desc = account c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3 not found: key not found';
export const axiosErrorMessagePrefix = 'Request failed with status code ';
export const axiosError404Message = axiosErrorMessagePrefix + '404';
export const defaultDenom = 'uc4e';

export const defaultAxiosErrorName = 'AxiosError';
export const defaultErrorName = 'Error';

export function createErrorResponseData(code: number, message: string) {
  return {
    code: code,
    message: message,
    details: []
  }
}

export function createAxiosError(message: string, response: AxiosResponse, name = defaultAxiosErrorName): AxiosError {
  const error = new AxiosError();
  error.name = name;
  error.message = message;
  error.response = response;
  return error;
}
