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

  // convert successful response to error if data validation fails
  public validateOrError(validator: (data: T | undefined) => string | null, errorCreator: (message: string) => E): RequestResponse<T, E> {
    if (this.isError()) {
      return this;
    }
    const validationError = validator(this.data);
    if (validationError) {
      return new RequestResponse<T, E>(errorCreator(validationError), undefined);
    }

    return this;
  }

  public static success<T, E>(data: T): RequestResponse<T, E> {
    return new RequestResponse<T, E>(undefined, data);
  }

  public static error<T, E>(error: E): RequestResponse<T, E> {
    return new RequestResponse<T, E>(error, undefined);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmptyResponse{
  //this is empty response
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BackendAppError{

}
