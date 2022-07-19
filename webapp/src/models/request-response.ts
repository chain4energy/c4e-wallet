export class RequestResponse<T, E> {
  error?: E;
  data?: T;

  constructor (error?: E, data?: T) {
    this.error = error;
    this.data = data;
  }

  public isSuccess(): boolean {
    return this.error === undefined;
  }

  public isError(): boolean {
    return this.error !== undefined;
  }

}
