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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmptyResponse{
  //this is empty response
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BackendAppError{

}
