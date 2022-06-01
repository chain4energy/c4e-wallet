import { AxiosResponse } from 'axios';

export class RequestResponse<T> {
  error: any;
  data?: AxiosResponse<T>;

  constructor (error: any, data?: AxiosResponse<T>) {
    this.error = error;
    this.data = data;
  }
}
