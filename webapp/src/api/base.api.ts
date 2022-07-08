import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import { RequestResponse } from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import { LoggedService } from '@/services/logged.service';
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";

const toast = useToast();

export class ErrorData<D> {
  name: string;
  message: string;
  status?: number;
  data?: D;
  dataToInfo?: (data:D)=> string

  constructor (name: string, message: string, status?: number, data?: D, dataToInfo?: (data:D)=> string) {
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
  code: string;
  message: string;
  details?: string;

}

export default abstract class BaseApi extends LoggedService {
  protected axiosInstance: AxiosInstance;

  constructor () {
    super();
    this.axiosInstance = axios.create({
    });
  }

  protected async axiosBlockchainApiCall<T> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {
    return await this.axiosCall<T, BlockchainApiErrorData>(config, lockScreen, localSpinner, skipErrorToast, (data:BlockchainApiErrorData)=> {return '\tCode: ' + data.code + '\r\n\tMessage: ' + data.message + ')'})
  }

  protected async axiosHasuraCall<T> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T, ErrorData<any>>> {
    return await this.axiosCall<T, any>(config, lockScreen, localSpinner, skipErrorToast)
  }

  private async axiosCall<T, E> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast: boolean, dataToInfo?: (data:E)=> string): Promise<RequestResponse<T, ErrorData<E>>> {
    this.before(lockScreen, localSpinner);
    try {
      this.logToConsole(LogLevel.DEBUG, 'Axios Request: ', JSON.stringify(config));
      const data = await this.axiosInstance.request<T>(config);
      this.logToConsole(LogLevel.DEBUG, 'Axios Response', JSON.stringify(data));
      return new RequestResponse<T, ErrorData<E>>(undefined, data.data);
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Axios Response', JSON.stringify(err));

      const error = err as Error | AxiosError<E, any>;
      
      let errorResp: ErrorData<E>
      if (error instanceof AxiosError && error.response != undefined) {
        errorResp = new ErrorData<E>(error.name, error.message, error.response.status, error.response.data, dataToInfo)
        this.logToConsole(LogLevel.ERROR, 'Axios Response name' + errorResp.name);
        this.logToConsole(LogLevel.ERROR, 'Axios Response message' + errorResp.message);
        this.logToConsole(LogLevel.ERROR, 'Axios Response status' + errorResp.status);
        this.logToConsole(LogLevel.ERROR, 'Axios Response data' + errorResp.data);
      } else {
        errorResp = new ErrorData<E>(error.name, error.message)
        this.logToConsole(LogLevel.ERROR, 'Axios Response name' + errorResp.name);
        this.logToConsole(LogLevel.ERROR, 'Axios Response message' + errorResp.message);
      }

      if (!skipErrorToast) {
        toast.error('Error requesting service:' + this.getServiceType() + '\r\n' + errorResp.getInfo());
      }
      return new RequestResponse<T, ErrorData<E>>(errorResp, undefined);
    } finally {
      this.after(lockScreen, localSpinner);
    }
  }

  public getDataFromUrl<T, E>(url: string,  lockScreen: boolean, localSpinner: LocalSpinner | null, onSuccess:(data:T)=> void, onError:((error?:ErrorData<E>) =>void )| null, pagination?: PagingModel) {
    this.axiosCall<T, E>({
      method: 'GET',
      url: url,
      params: pagination?.toAxiosParams()
    }, true, null, onError!=null).then(value => {
      if (value.isSuccess()) {
        if (value.data !== undefined) {
          onSuccess(value.data);
        } else if(onError != null) {
          onError(new ErrorData<E>('No data', 'No success data received'));
        }
      } else {
        if(onError != null) {
          onError(value.error);
        }
      }
    }).finally(() => {
      //
    });
  }

  before (lockScreen: boolean, localSpinner: LocalSpinner | null) {
    if(lockScreen) {
      useSplashStore().increment();
    }
    localSpinner?.turnOnFunction();
  }

  after (lockScreen: boolean, localSpinner: LocalSpinner | null) {
    if(lockScreen) {
      useSplashStore().decrement();
    }
    localSpinner?.turnOffFunction();
  }
}
