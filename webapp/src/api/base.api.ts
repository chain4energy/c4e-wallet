import { useSplashStore } from '@/store/splash.store';
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
 import { RequestResponse} from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import { LoggedService } from '@/services/logged.service';
import { LocalSpinner } from "@/services/model/localSpinner";
import { PaginatedResponse } from '@/models/blockchain/pagination';
import { useConfigurationStore } from '@/store/configuration.store';
import { KeybaseErrorData, KeybaseResponse } from '@/models/keybase/keybase';
import {AirdropErrData, BlockchainApiErrorData} from '@/models/blockchain/common';
import { HasuraErrorData } from '@/models/hasura/error';


export class BlockchainPagination {
  key?: string;
  limit?: number;
  reverse?: boolean;

  constructor(key?: string, limit?: number, reverse?: boolean) {
    this.key = key;
    this.limit = limit;
    this.reverse = reverse;
  }

}

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
        result += '\r\nData:' + this.dataToInfo(this.data);
      }
    }
    return result;
  }

}

export default abstract class BaseApi extends LoggedService {
  protected getAxiosInstance: () => AxiosInstance;

  constructor(axiosInstanceProvider: () => AxiosInstance) {
    super();
    this.getAxiosInstance = axiosInstanceProvider;
  }

  protected async axiosWith200ErrorCall<T, H, E>(
    config: AxiosRequestConfig,
    mapData: (hasureData: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string,
    isResponseError: (data: RequestResponse<H, ErrorData<E>>) => boolean,
    messages: {
      errorResponseName: string,
      errorResponseMassage: string,
      errorResponseToast: string,
      mappingErrorMassage: string,
    },
    errorDataToInfo?: (data: E) => string,

  ): Promise<RequestResponse<T, ErrorData<E>>>
  {

    const result = await this.axiosCall<H, E>(
      config,
      lockScreen,
      localSpinner,
      logPrefix,
      undefined,
      errorDataToInfo
    );
    if (result.isError()) {
      return new RequestResponse<T, ErrorData<E>>(result.error);
    }
    const asError = result.data as unknown as E;
    if (isResponseError(result)) {
      const errorResp = new ErrorData<E>(messages.errorResponseName, messages.errorResponseMassage, 200, asError, errorDataToInfo);
      return this.createErrorResponse(errorResp);
    }
    try {
      const mappedData = mapData(result.data);
      return new RequestResponse<T, ErrorData<E>>(undefined, mappedData);
    } catch (err) {
      const error = err as Error;
      this.logToConsole(LogLevel.ERROR, logPrefix + messages.mappingErrorMassage + this.getServiceType(), error.message);
      return this.createErrorResponse(new ErrorData<E>(error.name, error.message));
    }

  }

  protected async axiosKeybaseCall<T, H extends KeybaseResponse>(
    query: string,
    mapData: (hasureData: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string
  ): Promise<RequestResponse<T, ErrorData<KeybaseErrorData>>>
  {
    const config = {
      method: 'GET',
      url: useConfigurationStore().config.keybaseURL + query,
    };

    const errorDataToInfo = (data: KeybaseErrorData) => {
      let message = '';
      if (data.status) {
          message += '\r\n\tcode: ' + data.status.code;
          message += '\r\n\tname: ' + data.status.name;
          message += '\r\n\tdesc: ' + data.status.desc;
      }
      return message;
    };

    const isResponseError = (response: RequestResponse<H, ErrorData<KeybaseErrorData>>) => {return response.data?.status.code !== 0;};

    const messages = {
      errorResponseName: 'KeybaseError',
      errorResponseMassage: 'Keybase error received',
      errorResponseToast: 'Hasura Error: ',
      mappingErrorMassage: 'Keybase mapping error: ',
    };

    return this.axiosWith200ErrorCall<T, H, KeybaseErrorData>(
      config,
      mapData,
      lockScreen,
      localSpinner,
      logPrefix,
      isResponseError,
      messages,
      errorDataToInfo
    );
  }
  // protected async axiosAirdropCall<T, H extends KeybaseResponse>(
  //   url: string,
  //   mapData: (hasureData: H | undefined) => T,
  //   lockScreen: boolean,
  //   localSpinner: LocalSpinner | null,
  //   logPrefix: string,
  //   skipErrorToast = false
  // ): Promise<RequestResponse<T, ErrorData<KeybaseErrorData>>>
  // {
  //   const config = {
  //     method: 'GET',
  //     url: process.env.VUE_APP_AIRDROP + url,
  //   };
  //
  //   const errorDataToInfo = (data: KeybaseErrorData) => {
  //     let message = '';
  //     if (data.status) {
  //       message += '\r\n\tcode: ' + data.status.code;
  //       message += '\r\n\tname: ' + data.status.name;
  //       message += '\r\n\tdesc: ' + data.status.desc;
  //     }
  //     return message;
  //   };
  //
  //   const isResponseError = (response: RequestResponse<H, ErrorData<KeybaseErrorData>>) => {return response.data?.status.code !== 0;};
  //
  //   const messages = {
  //     errorResponseName: 'KeybaseError',
  //     errorResponseMassage: 'Keybase error received',
  //     errorResponseToast: 'Hasura Error: ',
  //     mappingErrorMassage: 'Keybase mapping error: ',
  //   };
  //
  //   return this.axiosWith200ErrorCall<T, H, KeybaseErrorData>(
  //     config,
  //     mapData,
  //     lockScreen,
  //     localSpinner,
  //     logPrefix,
  //     isResponseError,
  //     skipErrorToast,
  //     messages,
  //     errorDataToInfo
  //   );
  // }

  protected async axiosHasuraCall<T, H>(
    query: string,
    mapData: (hasureData: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string
  ): Promise<RequestResponse<T, ErrorData<HasuraErrorData>>>
  {
    const config = {
      method: 'POST',
      url: useConfigurationStore().config.hasuraURL,
      data: {
        query: query,
      }
    };

    const errorDataToInfo = (data: HasuraErrorData) => {
      let message = '';
      if (data.errors) {
        data.errors.forEach(e => {
          message += '\r\n\tMessage: ' + e.message;
        });
      }
      return message;
    };

    const isResponseError = (response: RequestResponse<H, ErrorData<HasuraErrorData>>) => {
      const asError = response.data as unknown as HasuraErrorData;
      return asError.errors && asError.errors.length > 0;
    };

    const messages = {
      errorResponseName: 'HasuraError',
      errorResponseMassage: 'Hasura error received',
      errorResponseToast: 'Hasura Error: ',
      mappingErrorMassage: 'Hasura mapping error: ',
    };

    return this.axiosWith200ErrorCall<T, H, HasuraErrorData>(
      config,
      mapData,
      lockScreen,
      localSpinner,
      logPrefix,
      isResponseError,
      messages,
      errorDataToInfo
    );
  }
  protected async axiosGetBlockchainApiPaginatedCall<T, BC extends PaginatedResponse>(
    url: string,
    pagination: BlockchainPagination | null,
    mapData: (bcData: BC | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix = '',
    displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean,
    handleError?: (errorResponse: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>) => RequestResponse<T, ErrorData<BlockchainApiErrorData>>
  ): Promise<{ response: RequestResponse<T, ErrorData<BlockchainApiErrorData>>, nextKey: string | null }>
  {
    let nextKey: string | null = null;
    const func = async (): Promise<RequestResponse<BC, ErrorData<BlockchainApiErrorData>>> => {
      const result: RequestResponse<BC, ErrorData<BlockchainApiErrorData>> = await this.axiosGetBlockchainDataPaginatedCall(
        url, pagination, lockScreen, localSpinner, logPrefix, displayAsError );
      if (result.data !== undefined) {
        nextKey = result.data.pagination.next_key;
      }
      return result;
    };

    return { response: await this.axiosGetBlockchainApiCallGeneric(mapData, func, logPrefix, handleError), nextKey: nextKey };
  }

  protected async axiosGetBlockchainApiCall<T, BC>(
    url: string,
    mapData: (bcData: BC | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix = '',
    displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean,
    handleError?: (errorResponse: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>) => RequestResponse<T, ErrorData<BlockchainApiErrorData>>): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>>
  {
    const func = (): Promise<RequestResponse<BC, ErrorData<BlockchainApiErrorData>>> => { return this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL + url
    }, lockScreen, localSpinner, logPrefix, displayAsError);};
    return this.axiosGetBlockchainApiCallGeneric(mapData, func, logPrefix, handleError);
  }

  // protected async axiosAirDropCall<T, BC>(
  //   url: string,
  //   mapData: (bcData: BC | undefined) => T,
  //   lockScreen: boolean,
  //   localSpinner: LocalSpinner | null,
  //   logPrefix = '',
  //   displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean,
  //   handleError?: (errorResponse: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>) => RequestResponse<T, ErrorData<BlockchainApiErrorData>>,
  //   skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>>
  // {
  //   const func = (): Promise<RequestResponse<BC, ErrorData<BlockchainApiErrorData>>> => { return this.axiosBlockchainApiCall({
  //     method: 'GET',
  //     url: process.env.VUE_APP_AIRDROP + url+ '.json'
  //   }, lockScreen, localSpinner, logPrefix, displayAsError, skipErrorToast);};
  //   return this.axiosGetBlockchainApiCallGeneric(mapData, func, logPrefix, handleError, skipErrorToast);
  // }

  protected async axiosGetAllBlockchainApiCallPaginated<T, BC extends PaginatedResponse>(
    url: string,
    mapData: (bcData: BC | undefined) => T,
    mapAndAddData: (data: T, bcData: BC | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix = '',
    displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>>
  {
    let data: T | undefined = undefined;
    let nextKey: string | null | undefined = undefined;
    do {
      const pagination = nextKey ? new BlockchainPagination(nextKey) : null;
      const result: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>
        = await this.axiosGetBlockchainDataPaginatedCall<BC>(url, pagination, lockScreen, localSpinner, logPrefix, displayAsError);
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
        return this.createErrorResponse(new ErrorData<BlockchainApiErrorData>(error.name, error.message));
      }
    } while (data === undefined || (nextKey !== null && nextKey !== undefined));
    return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(undefined, data);
  }

  private async axiosGetBlockchainApiCallGeneric<T, BC>(
    mapData: (bcData: BC | undefined) => T,
    getFunction: () => Promise<RequestResponse<BC, ErrorData<BlockchainApiErrorData>>>,
    logPrefix: string,
    handleError: ((errorResponse: RequestResponse<BC, ErrorData<BlockchainApiErrorData>>) => RequestResponse<T, ErrorData<BlockchainApiErrorData>>) | undefined): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>>
  {
    const result: RequestResponse<BC, ErrorData<BlockchainApiErrorData>> = await getFunction();
    if (result.isError()) {
      if (handleError === undefined) {
        return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(result.error);
      } else {
        return handleError(result);
      }
    }
    try {
      this.logToConsole(LogLevel.DEBUG, logPrefix + 'data to map: ' + this.getServiceType(), this.stringify(result.data));
      const mapped = mapData(result.data);
      return new RequestResponse<T, ErrorData<BlockchainApiErrorData>>(undefined, mapped);
    } catch (err) {
      const error = err as Error;
      this.logToConsole(LogLevel.ERROR, logPrefix + 'mapping error: ' + this.getServiceType(), error.message);
      return this.createErrorResponse(new ErrorData<BlockchainApiErrorData>(error.name, error.message));
    }
  }

  private async axiosBlockchainApiCall<T>(
    config: AxiosRequestConfig,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix = '',
    displayAsError?: ((error: ErrorData<BlockchainApiErrorData>) => boolean)
    ): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>>
  {
    return await this.axiosCall<T, BlockchainApiErrorData>(
      config,
      lockScreen,
      localSpinner,
      logPrefix,
      displayAsError,
      (data: BlockchainApiErrorData) => { return '\r\n\tCode: ' + data.code + '\r\n\tMessage: ' + data.message + ')'; }
    );
  }
  // private async axiosAirDropAPICall<T>(
  //   config: AxiosRequestConfig,
  //   lockScreen: boolean,
  //   localSpinner: LocalSpinner | null,
  //   logPrefix = '',
  //   displayAsError?: ((error: ErrorData<BlockchainApiErrorData>) => boolean),
  //   skipErrorToast = false
  // ): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>>
  // {
  //   return await this.axiosCall<T, BlockchainApiErrorData>(
  //     config,
  //     lockScreen,
  //     localSpinner,
  //     skipErrorToast,
  //     logPrefix,
  //     displayAsError,
  //     (data: BlockchainApiErrorData) => { return '\r\n\tCode: ' + data.code + '\r\n\tMessage: ' + data.message + ')'; }
  //   );
  // }

  protected async axiosAirdropCall<T, H>(
    localUrl: string,
    mapData: (data: H | undefined) => T,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix: string
  ): Promise<RequestResponse<T, ErrorData<AirdropErrData>>> {
    const config = {
      method: 'GET',
      url: localUrl,
    };

    const errorDataToInfo = (data: AirdropErrData) => {
      return data.message;
    };

    const isResponseError = (response: RequestResponse<H, ErrorData<AirdropErrData>>) => {
      return response.error != undefined;
    };

    const messages = {
      errorResponseName: 'Airdrop data Error',
      errorResponseMassage: 'Airdrop data error received',
      errorResponseToast: 'Airdrop data Error: ',
      mappingErrorMassage: 'Airdrop data mapping error: ',
    };

    return this.axiosWith200ErrorCall<T, H, AirdropErrData>(
      config,
      mapData,
      lockScreen,
      localSpinner,
      logPrefix,
      isResponseError,
      messages,
      errorDataToInfo
    );
  }


  private async axiosGetBlockchainDataPaginatedCall<P extends PaginatedResponse>(
    url: string,
    pagination: BlockchainPagination | null,
    lockScreen: boolean,
    localSpinner: LocalSpinner | null,
    logPrefix = '',
    displayAsError?: (error: ErrorData<BlockchainApiErrorData>) => boolean): Promise<RequestResponse<P, ErrorData<BlockchainApiErrorData>>> {
    const paginationData: any = {};
    if (pagination) {
      if (pagination.key) { paginationData['pagination.key'] = pagination.key; }
      if (pagination.limit) { paginationData['pagination.limit'] = pagination.limit; }
      if (pagination.reverse) { paginationData['pagination.reverse'] = pagination.reverse; }
    }
    const result: RequestResponse<P, ErrorData<BlockchainApiErrorData>> = await this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL + url,
      params: paginationData
    }, lockScreen, localSpinner, logPrefix, displayAsError);
    return result;
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

export interface ServiceErrorHandler<E>{
  handleError(appError:ErrorData<E>): void
  // handleError(appError: BackendAppError):void
}

