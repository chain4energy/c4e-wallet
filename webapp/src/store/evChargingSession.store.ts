import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ErrorData} from "@/api/base.api";
import {InitPaymentRequest} from "@/models/evServiceCommons";
import {SessionInfo} from "@/models/sessionInfo";
import {setTokens} from "@/services/utils";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import {EvServiceContext} from "@/store/evServiceErrorHandler";
import evServiceErrorHandler from "@/store/evServiceErrorHandler";

interface EvChargingSessionStoreState {
  loggedIn: boolean,

  chargingSessionUrl: string,
  chargingSessionResourceCode: string,
  sessionInfo: SessionInfo | undefined,
}

export const useEvChargingSessionStore = defineStore({
  id: 'evChargingSessionStoreState',

  state: (): EvChargingSessionStoreState => {
    return {
      loggedIn: false,
      chargingSessionUrl: "",
      chargingSessionResourceCode: "",
      sessionInfo: undefined,
    };
  },

  actions: {
    async loginWithResource(lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().loginWithResource({
        resourceCode: this.chargingSessionResourceCode
      }, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          setTokens(response.data.access_token.token, response.data.refresh_token.token);
          this.loggedIn = true;
          onSuccess?.();
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.LOG_IN, onFail);
        }
      });
    },
    async fetchSessionInfo(lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().getSesisonInfo(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          this.sessionInfo = response.data;
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.SESSION_INFO_FETCH, onFail);
        }
      });
    },
    async initPayment(initPaymentRequest: InitPaymentRequest, lockscreen = true, onSuccess?: ((paymentUrl:string) => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().initPayment(this.chargingSessionUrl, initPaymentRequest, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          onSuccess?.(response.data.paymentUrl);
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.INIT_PAYMENT, onFail);
        }
      });
    },

    async startCharging(lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().startCharging(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess?.();
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.CHARGING_SESSION_OPERATION, onFail);
        }
      });
    },

    async stopCharging(lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().stopCharging(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess?.();
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.CHARGING_SESSION_OPERATION, onFail);
        }
      });
    },
  },

  getters: {
    getChargingSessionUrl(): string {
      return this.chargingSessionUrl;
    },
    getSessionInfo(): SessionInfo | undefined {
      return this.sessionInfo;
    },
    getChargingSessionResourceCode():string{
      return this.chargingSessionResourceCode;
    }
  }
});

// function handleError(error:ErrorData<EvServiceApplicationError> | undefined, evServiceContext: EvServiceContext,  onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)){
//   const defaultErrorHandler = useEvServiceErrorHandler.getDefaultErrorHandler(error, evServiceContext);
//   if (onFail) {
//     onFail(defaultErrorHandler, error);
//   } else {
//     defaultErrorHandler();
//   }
// }
