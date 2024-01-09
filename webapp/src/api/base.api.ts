import { useSplashStore } from '@/store/splash.store';
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
 import { RequestResponse} from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import { LoggedService } from '@/services/logged.service';
import { LocalSpinner } from "@/services/model/localSpinner";

export class ErrorData<D> {
  readonly name: string;
  readonly message: string;
  readonly status?: number;
  readonly data?: D;
  private readonly dataToInfo?: (data: D) => string

  constructor(name: string, message: string, status?: number, data?: D, dataToInfo?: (data: D) => string) {
    this.name = name;
    this.message = message;
    this.status = status;
    this.data = data;
    this.dataToInfo = dataToInfo;
  }
}

export default abstract class BaseApi extends LoggedService {
  protected getAxiosInstance: () => AxiosInstance;

  constructor(axiosInstanceProvider: () => AxiosInstance) {
    super();
    this.getAxiosInstance = axiosInstanceProvider;
  }

  protected async axiosCall<T, E>(config: AxiosRequestConfig,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string,
    displayAsError?: (error: ErrorData<E>) => boolean,
    errorDataToInfo?: (data: E) => string): Promise<RequestResponse<T, ErrorData<E>>> {
    this.before(lockScreen, localSpinner);
    try {
      this.logToConsole(LogLevel.DEBUG, logPrefix + 'Axios Request: ', this.stringify(config));
      const data = await this.getAxiosInstance().request<T>(config);
      this.logToConsole(LogLevel.DEBUG, logPrefix + 'Axios Response', this.stringify(data));
      return new RequestResponse<T, ErrorData<E>>(undefined, data.data);
    } catch (err) {
      const error = err as Error | AxiosError<E, any>;
      let errorResp: ErrorData<E>;
      if (error instanceof AxiosError && error.response != undefined) {
        errorResp = new ErrorData<E>(error.name, error.message, error.response.status, error.response.data, errorDataToInfo);
      } else {
        errorResp = new ErrorData<E>(error.name, error.message);
      }
      const isError = displayAsError !== undefined ? displayAsError(errorResp) : true;
      const logLevel = isError ? LogLevel.ERROR : LogLevel.DEBUG;
      this.logToConsole(logLevel, logPrefix + 'Axios Response', this.stringify(err));
      this.logToConsole(logLevel, logPrefix + 'Error data: ' + this.stringify(errorResp));
      return new RequestResponse<T, ErrorData<E>>(errorResp);
    } finally {
      this.after(lockScreen, localSpinner);
    }
  }

  before(lockScreen: boolean, localSpinner: LocalSpinner | null) {
    if (lockScreen) {
      useSplashStore().increment();
    }
    localSpinner?.turnOnFunction();
  }

  after(lockScreen: boolean, localSpinner: LocalSpinner | null) {
    if (lockScreen) {
      useSplashStore().decrement();
    }
    localSpinner?.turnOffFunction();
  }

  private createErrorResponse<T, E>(errorData: ErrorData<E>): RequestResponse<T, ErrorData<E>> {
    return new RequestResponse<T, ErrorData<E>>(errorData);
  }

  protected stringify(value: any): string {
    return JSON.stringify(value, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    );
  }
}

