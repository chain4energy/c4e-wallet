import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequestResponse } from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import { LoggedService } from '@/services/logged.service';
import { PagingModel } from "@/services/model/paging.model";
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
    let result = 'Name: ' + this.name + '\r\nMessage: ' + this.message
    if (this.status !== undefined) {
      result += '\r\nStatus: ' + this.status
    }

    if (this.data !== undefined) {
      if (this.dataToInfo == undefined) {
        result += '\r\nData: ' + this.data
      } else {
        result += '\r\nData:\r\n' + this.dataToInfo(this.data)
      }
    }
    result += ')'
    return result
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

  protected async axiosBlockchainApiCall<T>(config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, logPrefix = '', skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {
    return await this.axiosCall<T, BlockchainApiErrorData>(config, lockScreen, localSpinner, skipErrorToast, logPrefix, (data: BlockchainApiErrorData) => { return '\tCode: ' + data.code + '\r\n\tMessage: ' + data.message + ')' })
  }

  public async axiosGetBlockchainApiCall<T, BC>(url: string,
      mapData: (bcData: BC | undefined) => T,
      lockScreen: boolean,
      localSpinner: LocalSpinner | null,
      logPrefix = '',
      skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {

    const result: RequestResponse<BC, ErrorData<BlockchainApiErrorData>> =  await this.axiosBlockchainApiCall({
      method: 'GET',
      url: url
    }, lockScreen, localSpinner, logPrefix, skipErrorToast)
    if (result.isError()) {
      return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(result.error);
    }
    const coin = mapData(result.data);
    return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(undefined, coin);
  }

  public async axiosGetBlockchainApiCallPaginated<T, BC extends PaginatedResponse>(url: string,
      mapData: (bcData: BC | undefined) => T,
      mapAndAddData: (data: T, bcData: BC | undefined) => T,
      lockScreen: boolean,
      localSpinner: LocalSpinner | null,
      logPrefix = '',
      skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {
    let data: T | undefined = undefined;
    let nextKey: string | null | undefined = undefined
    do {
      const result: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>
        = await this.axiosSingleGetBlockchainApiCallPaginated<BC>(url, data !== undefined, nextKey, lockScreen, localSpinner, logPrefix, skipErrorToast);
      if (result.isError()) {
        return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(result.error);
      }
      nextKey = result.data?.pagination.next_key
      if (data === undefined) {
        data = mapData(result.data);
      } else {
        data = mapAndAddData(data, result.data);
      }
    } while (data === undefined || (nextKey !== null && nextKey !== undefined));
    return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(undefined, data);
  }
  private async axiosSingleGetBlockchainApiCallPaginated<P extends PaginatedResponse>(url: string,
    pagination: boolean,
    nextKey: string | null | undefined,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix = '',
    skipErrorToast = false): Promise<RequestResponse<P, ErrorData<BlockchainApiErrorData>>> {
    if (pagination) {
      url += '?pagination.key=' + nextKey
    }
    const result: RequestResponse<P, ErrorData<BlockchainApiErrorData>> = await this.axiosBlockchainApiCall({
      method: 'GET',
      url: url
    }, lockScreen, localSpinner, logPrefix, skipErrorToast)
    return result;
  }

  protected async axiosHasuraCall<T>(config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T, ErrorData<any>>> {
    return await this.axiosCall<T, any>(config, lockScreen, localSpinner, skipErrorToast, '')
  }

  private async axiosCall<T, E>(config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast: boolean, logPrefix: string, dataToInfo?: (data: E) => string): Promise<RequestResponse<T, ErrorData<E>>> {
    this.before(lockScreen, localSpinner);
    try {
      this.logToConsole(LogLevel.DEBUG, logPrefix + 'Axios Request: ', JSON.stringify(config));
      const data = await this.getAxiosInstance().request<T>(config);
      this.logToConsole(LogLevel.DEBUG, logPrefix + 'Axios Response', JSON.stringify(data));
      return new RequestResponse<T, ErrorData<E>>(undefined, data.data);
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response', JSON.stringify(err));

      const error = err as Error | AxiosError<E, any>;

      let errorResp: ErrorData<E>

      if (error instanceof AxiosError && error.response != undefined) {
        errorResp = new ErrorData<E>(error.name, error.message, error.response.status, error.response.data, dataToInfo)
        this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response name ' + errorResp.name);
        this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response message ' + errorResp.message);
        this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response status ' + errorResp.status);
        this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response data ' + errorResp.data);
        this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response code ' + error.code);

      } else {
        errorResp = new ErrorData<E>(error.name, error.message)
        this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response name ' + errorResp.name);
        this.logToConsole(LogLevel.ERROR, logPrefix + 'Axios Response message ' + errorResp.message);
      }

      if (!skipErrorToast) {
        toast.error('Error requesting service:' + this.getServiceType() + '\r\n' + errorResp.getInfo());
      }
      return new RequestResponse<T, ErrorData<E>>(errorResp, undefined);
    } finally {
      this.after(lockScreen, localSpinner);
    }
  }

  public getDataFromUrl<T, E>(url: string, lockScreen: boolean, localSpinner: LocalSpinner | null, onSuccess: (data: T) => void, onError: ((error?: ErrorData<E>) => void) | null, pagination?: PagingModel) {
    this.axiosCall<T, E>({
      method: 'GET',
      url: url,
      params: pagination?.toAxiosParams()
    }, true, null, onError != null, '').then(value => {
      if (value.isSuccess()) {
        if (value.data !== undefined) {
          onSuccess(value.data);
        } else if (onError != null) {
          onError(new ErrorData<E>('No data', 'No success data received'));
        }
      } else {
        if (onError != null) {
          onError(value.error);
        }
      }
    }).finally(() => {
      //
    });
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
}
