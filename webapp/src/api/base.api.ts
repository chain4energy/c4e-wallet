import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequestResponse } from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import { LoggedService } from '@/services/logged.service';
import { LocalSpinner } from "@/services/model/localSpinner";
import { PaginatedResponse } from '@/models/blockchain/pagination';

const toast = useToast();

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

  getInfo(): string {
    let result = 'Name: ' + this.name + '\r\nMessage: ' + this.message;
    if (this.status !== undefined) {
      result += '\r\nStatus: ' + this.status;
    }

    if (this.data !== undefined) {
      if (this.dataToInfo == undefined) {
        result += '\r\nData: ' + this.data;
      } else {
        result += '\r\nData:\r\n' + this.dataToInfo(this.data);
      }
    }
    result += ')';
    return result;
  }

}

export interface BlockchainApiErrorData {
  code: number;
  message: string;
  details?: string;

}

export default abstract class BaseApi extends LoggedService {
  protected getAxiosInstance: () => AxiosInstance;

  constructor(axiosInstanceProvider: () => AxiosInstance) {
    super();
    this.getAxiosInstance = axiosInstanceProvider;
  }

  protected async axiosBlockchainApiCall<T>(
    config: AxiosRequestConfig, 
    lockScreen: boolean, 
    localSpinner: LocalSpinner | null, 
    logPrefix = '', 
    displayAsError?: ((error: ErrorData<BlockchainApiErrorData>) => boolean),
    skipErrorToast = false
    ): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {
    return await this.axiosCall<T, BlockchainApiErrorData>(
      config,
      lockScreen,
      localSpinner,
      skipErrorToast,
      logPrefix,
      displayAsError,
      (data: BlockchainApiErrorData) => { return '\tCode: ' + data.code + '\r\n\tMessage: ' + data.message + ')'; }
    );
  }

  public async axiosGetBlockchainApiCall<T, BC>(url: string,
      mapData: (bcData: BC | undefined) => T,
      lockScreen: boolean,
      localSpinner: LocalSpinner | null,
      logPrefix = '',
      displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean,
      handleError?: (errorResponse: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>)=> RequestResponse<T, ErrorData<BlockchainApiErrorData>>,
      skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {

    const result: RequestResponse<BC, ErrorData<BlockchainApiErrorData>> =  await this.axiosBlockchainApiCall({
      method: 'GET',
      url: url
    }, lockScreen, localSpinner, logPrefix, displayAsError, skipErrorToast);
    if (result.isError()) {
      if (handleError === undefined) {
        return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(result.error);
      } else {
        return handleError(result);
      }
    }
    try {
      const mapped = mapData(result.data);
      return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(undefined, mapped);
    } catch (err) {
      const error = err as Error;
      this.logToConsole(LogLevel.ERROR, logPrefix + 'mapping error: ' + this.getServiceType(), error.message);
      return this.createErrorResponseWithToast(new ErrorData<BlockchainApiErrorData>(error.name, error.message), 'Mapping error: ', !skipErrorToast);

      // if (!skipErrorToast) {
      //   toast.error('mapping error: ' + this.getServiceType() + '\r\n' + error.message);
      // }
      // return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(new ErrorData<BlockchainApiErrorData>(error.name, error.message));
    }
  }

  public async axiosGetAllBlockchainApiCallPaginated<T, BC extends PaginatedResponse>(url: string,
      mapData: (bcData: BC | undefined) => T,
      mapAndAddData: (data: T, bcData: BC | undefined) => T,
      lockScreen: boolean,
      localSpinner: LocalSpinner | null,
      logPrefix = '',
      displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean,
      skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {
    let data: T | undefined = undefined;
    let nextKey: string | null | undefined = undefined;
    do {
      const result: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>
        = await this.axiosGetBlockchainApiCallPaginated<BC>(url, data !== undefined, nextKey, lockScreen, localSpinner, logPrefix, displayAsError, skipErrorToast);
      if (result.isError()) {
        return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(result.error);
      }
      nextKey = result.data?.pagination.next_key;
      try {
        if (data === undefined) {
          data = mapData(result.data);
        } else {
          data = mapAndAddData(data, result.data);
        }
      } catch (err) {
        const error = err as Error;
        this.logToConsole(LogLevel.ERROR, logPrefix + 'mapping error: ' + this.getServiceType(), error.message);
        return this.createErrorResponseWithToast(new ErrorData<BlockchainApiErrorData>(error.name, error.message), 'Mapping error: ', !skipErrorToast);

        // if (!skipErrorToast) {
        //   toast.error('mapping error: ' + this.getServiceType() + '\r\n' + error.message);
        // }
        // return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(new ErrorData<BlockchainApiErrorData>(error.name, error.message));
      }
    } while (data === undefined || (nextKey !== null && nextKey !== undefined));
    return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(undefined, data);
  }
  private async axiosGetBlockchainApiCallPaginated<P extends PaginatedResponse>(url: string,
    pagination: boolean,
    nextKey: string | null | undefined,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix = '',
    displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean,
    skipErrorToast = false): Promise<RequestResponse<P, ErrorData<BlockchainApiErrorData>>> {
    if (pagination) {
      url += '?pagination.key=' + nextKey;
    }
    const result: RequestResponse<P, ErrorData<BlockchainApiErrorData>> = await this.axiosBlockchainApiCall({
      method: 'GET',
      url: url
    }, lockScreen, localSpinner, logPrefix, displayAsError, skipErrorToast);
    return result;
  }

  protected async axiosHasuraCall<T>(config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T, ErrorData<any>>> {
    return await this.axiosCall<T, any>(config, lockScreen, localSpinner, skipErrorToast, '');
  }

  private async axiosCall<T, E>(config: AxiosRequestConfig,
    lockScreen: boolean, 
    localSpinner: LocalSpinner | null, 
    skipErrorToast: boolean, 
    logPrefix: string, 
    displayAsError?: (error :ErrorData<E>) => boolean,
    dataToInfo?: (data: E) => string): Promise<RequestResponse<T, ErrorData<E>>> {
    this.before(lockScreen, localSpinner);
    try {
      this.logToConsole(LogLevel.DEBUG, logPrefix + 'Axios Request: ', JSON.stringify(config));
      const data = await this.getAxiosInstance().request<T>(config);
      this.logToConsole(LogLevel.DEBUG, logPrefix + 'Axios Response', JSON.stringify(data));
      return new RequestResponse<T, ErrorData<E>>(undefined, data.data);
    } catch (err) {

      const error = err as Error | AxiosError<E, any>;

      this.logToConsole(LogLevel.DEBUG, logPrefix + 'Axios Response', JSON.stringify(err));

      let errorResp: ErrorData<E>;

      if (error instanceof AxiosError && error.response != undefined) {
        errorResp = new ErrorData<E>(error.name, error.message, error.response.status, error.response.data, dataToInfo);
      } else {
        errorResp = new ErrorData<E>(error.name, error.message);
      }
      const isError = displayAsError !== undefined ? displayAsError(errorResp): true;
      const logLevel = isError ? LogLevel.ERROR : LogLevel.DEBUG;
      this.logToConsole(logLevel, logPrefix + 'Axios Response', JSON.stringify(err));
      this.logToConsole(logLevel, logPrefix + 'Error data: ' + JSON.stringify(errorResp));

      // if (!skipErrorToast && isError) {
      //   toast.error('Error requesting service:' + this.getServiceType() + '\r\n' + errorResp.getInfo());
      // }
      // return new RequestResponse<T, ErrorData<E>>(errorResp);

      return this.createErrorResponseWithToast(errorResp, 'Error sending HTTP request: ', !skipErrorToast && isError);
    } finally {
      this.after(lockScreen, localSpinner);
    }
  }

  // public getDataFromUrl<T, E>(url: string, lockScreen: boolean, localSpinner: LocalSpinner | null, onSuccess: (data: T) => void, onError: ((error?: ErrorData<E>) => void) | null, pagination?: PagingModel) {
  //   this.axiosCall<T, E>({
  //     method: 'GET',
  //     url: url,
  //     params: pagination?.toAxiosParams()
  //   }, true, null, onError != null, '').then(value => {
  //     if (value.isSuccess()) {
  //       if (value.data !== undefined) {
  //         onSuccess(value.data);
  //       } else if (onError != null) {
  //         onError(new ErrorData<E>('No data', 'No success data received'));
  //       }
  //     } else {
  //       if (onError != null) {
  //         onError(value.error);
  //       }
  //     }
  //   }).finally(() => {
  //     //
  //   });
  // }

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

  private createErrorResponseWithToast<T, E>(errorData: ErrorData<E>, toastMessageBeginning: string | undefined, showErrorToast: boolean): RequestResponse<T, ErrorData<E>> {
    if (showErrorToast) {
      toast.error(toastMessageBeginning + this.getServiceType() + '\r\n' + errorData.getInfo());
    }
    return new RequestResponse<T, ErrorData<E>>(errorData);
  }
}
