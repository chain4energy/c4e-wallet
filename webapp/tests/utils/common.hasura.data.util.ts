import { AxiosError, AxiosResponse } from "axios";
import { axiosErrorMessagePrefix, defaultAxiosErrorName } from "./common.blockchain.data.util";

export const defaultHasuraErrorName = 'HasuraError';
export const defaultHasuraErrorMessage = 'Hasura error received';


export function createHasuraError(message: string) {
  return {
    errors: [
      {
        extensions: {
          path: "$.selectionSet.average_block_time_per_hour.selectionSet.average_timeh",
          code: "validation-failed"
        },
        message: message
      }
    ]
  }
}

export function createAxiosError(message: string, response: AxiosResponse, name = defaultAxiosErrorName): AxiosError {
  const error = new AxiosError();
  error.name = name;
  error.message = message;
  error.response = response;
  return error;
}

export function createErrorResponse(status: number) {
  const axiosErrorMessage = axiosErrorMessagePrefix + status;
  const response = {
    status: status,
    statusText: '',
  };
  return createAxiosError(axiosErrorMessage, response as AxiosResponse);
}
