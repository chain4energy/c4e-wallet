import { AxiosResponse } from 'axios';

export class RequestResponse<T> {
  error: any;
  data?: T;

  constructor (error: any, data?: T) {
    this.error = error;
    this.data = data;
  }
}
