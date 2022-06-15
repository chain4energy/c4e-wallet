import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import { RequestResponse } from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import { LoggedService } from '@/services/logged.service';
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";

const toast = useToast();

export default abstract class BaseApi extends LoggedService {
  protected axiosInstance: AxiosInstance;

  constructor () {
    super();
    this.axiosInstance = axios.create({
    });
  }

  protected async axiosCall<T> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T>> {
    this.before(lockScreen, localSpinner);
    try {
      this.logToConsole(LogLevel.DEBUG, 'Axios Request: ', JSON.stringify(config));
      const data = await this.axiosInstance.request<T>(config);
      this.logToConsole(LogLevel.DEBUG, 'Axios Response', JSON.stringify(data));
      return new RequestResponse<T>(null, data.data);
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Axios Response', JSON.stringify(err));
      const error = err as Error | AxiosError;
      if (!skipErrorToast) {
        toast.error('Error requesting service:' + this.getServiceType());
      }
      return new RequestResponse<T>(error);
    } finally {
      this.after(lockScreen, localSpinner);
    }
  }

  public getDataFromUrl<X>(url: string,  lockScreen: boolean, localSpinner: LocalSpinner | null, onSuccess:(data:X)=> void, onError:((error:any) =>void )| null, pagination?: PagingModel) {
    this.axiosCall<X>({
      method: 'GET',
      url: url,
      params: pagination?.toAxiosParams()
    }, true, null, onError!=null).then(value => {
      if (value.error === null) {
        if (value.data !== undefined) {
          onSuccess(value.data);
        }
        if(onError != null) {
          onError("Data is null");
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
