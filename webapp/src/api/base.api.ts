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

  constructor (name: string, message: string, status?: number, data?: D) {
    this.name = name;
    this.message = message;
    this.status = status;
    this.data = data;
  }

}

export class BlockchainApiErrorData {
  code: string;
  message: string;
  details?: string;

  constructor (code: string, message: string, details?: string) {
    this.code = code;
    this.message = message;
    this.details = details;
  }

}


export default abstract class BaseApi extends LoggedService {
  protected axiosInstance: AxiosInstance;

  constructor () {
    super();
    this.axiosInstance = axios.create({
    });
  }

  protected async axiosBlockchainApiCall<T> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T, ErrorData<BlockchainApiErrorData>>> {
    return await this.axiosCall<T, BlockchainApiErrorData>(config, lockScreen, localSpinner, skipErrorToast)
  }

  protected async axiosHasuraCall<T> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T, ErrorData<any>>> {
    return await this.axiosCall<T, any>(config, lockScreen, localSpinner, skipErrorToast)
  }

  private async axiosCall<T, E> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T, ErrorData<E>>> {
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
        errorResp = new ErrorData<E>(error.name, error.message, error.response.status, error.response.data)
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
        toast.error('Error requesting service:' + this.getServiceType());
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
