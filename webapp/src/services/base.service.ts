import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import { RequestResponse } from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import { LoggedService } from '@/services/logged.service';
import {useUserStore} from "@/store/user.store";
import {DataHolder} from "@/models/data-holder";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
// import {AuthResponse} from "@/models/auth-response";

const toast = useToast();
const refreshUrl = '/api/management/refresh';


export default abstract class BaseService<T> extends LoggedService {
  protected axiosInstance: AxiosInstance;

  constructor () {
    super();
    this.axiosInstance = axios.create({
    });
  }

  getListDataUrlByRole() : string{
    toast.error("Method 'getListDataUrlByRole' Not Implemented in:" + this.getServiceType());
    throw new Error("Not Implemented");
  }

  setListDataToStore(dataHolder: T) :void{
    toast.error("Method 'setListDataToStore' Not Implemented in:" + this.getServiceType());
    throw new Error("Not Implemented");
  }

  getSingleDataUrlByRole(): string{
    toast.error("Method 'getSingleDataUrlByRole' Not Implemented in:" + this.getServiceType());
    throw new Error("Not Implemented");
  }

  setSingleDataToStore(singleData: T) :void {
    toast.error("Method 'setSingleDataToStore' Not Implemented in:" + this.getServiceType());
    throw new Error("Not Implemented");
  }

  private refreshCounter = 0;

  protected async axiosCall<T> (config: AxiosRequestConfig, lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<T>> {
    const userStore = useUserStore();
    // if(userStore.isLoggedIn) {
    //   config.headers = { Authorization: 'Bearer ' + userStore.accessToken};
    // } else {
    //   //TODO
    // }
    this.before(lockScreen, localSpinner);
    try {
      this.logToConsole(LogLevel.DEBUG, 'Axios Request: ', JSON.stringify(config));
      const data = await this.axiosInstance.request<T>(config);
      this.logToConsole(LogLevel.DEBUG, 'Axios Response', JSON.stringify(data));
      return new RequestResponse<T>(null, data);
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Axios Response', JSON.stringify(err));
      //Check if 401 and refresh token once
      const error = err as Error | AxiosError;
      // if(axios.isAxiosError(error) && (error.response?.status == 401) && this.refreshCounter < 1){
      //   this.refreshCounter ++;
      //   const temp = await this.refreshToken().then(isRefreshOk => {
      //       if(isRefreshOk){
      //         return this.axiosCall<T>(config, lockScreen, localSpinner, skipErrorToast);
      //       }
      //     }).finally(()=> this.refreshCounter--);
      //   if(temp != undefined) {
      //     return temp;
      //   }
      // }
      if (!skipErrorToast) {
        toast.error('Error requesting service:' + this.getServiceType());
      }
      return new RequestResponse<T>(error);
    } finally {
      this.after(lockScreen, localSpinner);
    }
  }

  // private async refreshToken():Promise<boolean>{
  //   const userStore = useUserStore();
  //   const config: AxiosRequestConfig = {method:"POST", url:refreshUrl};
  //   config.headers = { Authorization: 'Bearer ' + userStore.refreshToken};
  //   try {
  //     const value = await this.axiosInstance.request<AuthResponse>(config);
  //     if (value.data.access_token != undefined) {
  //       useUserStore().setAccessToken(value.data.access_token);
  //     }
  //     if (value.data.refresh_token != undefined) {
  //       useUserStore().setRefreshToken(value.data.refresh_token);
  //     }
  //     useUserStore().setIsLoggedIn();
  //     this.logToConsole(LogLevel.DEBUG, 'Refresh Token OK');
  //     return true;
  //   } catch (err) {
  //     this.logToConsole(LogLevel.ERROR, 'Refresh Token ERROR: Axios Response', JSON.stringify(err));
  //     return false;
  //   }
  // }

  public getListData(pagination: PagingModel|null, lockScreen: boolean, localSpinner: LocalSpinner | null){
    const promise: Promise<RequestResponse<T>> = this.axiosCall({
      method: 'GET',
      url: this.getListDataUrlByRole(),
      params: pagination?.toAxiosParams()
    }, lockScreen, localSpinner);
    promise.then(value => {
      if (value.error === null) {
        if (value.data!.data !== null) {
          this.setListDataToStore(value.data!.data);
          this.logToConsole(LogLevel.INFO, this.getServiceType() + JSON.stringify(value.data!.data, null, 2));
        } else {
          this.logToConsole(LogLevel.INFO, this.getServiceType() + ' are EMPTY');
        }
      } else {
        this.logToConsole(LogLevel.ERROR, this.getServiceType()  + ' Response value error: ' + value.error + ' data:' + value.data?.data);
      }
    }).finally(() => {
      // this.after(lockScreen, localSpinner);
    });
  }

  public getSingleData(lockScreen: boolean, localSpinner: LocalSpinner | null){
    const promise: Promise<RequestResponse<T>> = this.axiosCall({
      method: 'GET',
      url: this.getSingleDataUrlByRole()
    }, lockScreen, localSpinner);
    promise.then(value => {
      if (value.error === null) {
        if (value.data!.data !== null) {
          this.setSingleDataToStore(value.data!.data);
          this.logToConsole(LogLevel.INFO, this.getServiceType() + JSON.stringify(value.data!.data, null, 2));
        } else {
          this.logToConsole(LogLevel.INFO, this.getServiceType() + ' are EMPTY');
        }
      } else {
        this.logToConsole(LogLevel.ERROR, this.getServiceType()  + ' Response value error: ' + value.error + ' data:' + value.data?.data);
      }
    }).finally(() => {
      // this.after(lockScreen, localSpinner);
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
