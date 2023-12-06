import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ErrorData} from "@/api/base.api";
import {ChargePoint} from "@/ev/models/chargePoint";
import {EvServiceApplicationError, InitPaymentRequest} from "@/ev/models/evServiceCommons";
import {RequestResponse} from "@/models/request-response";
import {Jwt} from "@/models/user/jwt";
import {setAuthTokens} from "axios-jwt";
import {SessionInfo} from "@/ev/models/sessionInfo";
import {setTokens} from "@/ev/services/utils";

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
      chargingSessionUrl : "",
      chargingSessionResourceCode : "",
      sessionInfo: undefined,
    };
  },

  actions: {
    async loginWithResource(lockscreen = true, onSuccess: (() => void)) {
      await apiFactory.evServiceApi().loginWithResource({
        resourceCode: this.chargingSessionResourceCode
      }, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          this.setTokens(responseDate);
          onSuccess();
        }
      });
    },
    async fetchSessionInfo(lockscreen = true) {
      await apiFactory.evServiceApi().getSesisonInfo(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.data) {
          this.sessionInfo = response.data
          if (!this.sessionInfo.cost) {
            this.sessionInfo.cost = 0;
          }
          if (!this.sessionInfo.energyConsumed) {
            this.sessionInfo.energyConsumed = 0;
          }
        } // TODO: error handling
      });
    },
    async initPayment(initPaymentRequest: InitPaymentRequest, lockscreen: boolean, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().initPayment(this.chargingSessionUrl, initPaymentRequest, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
      });
    },

    async startCharging(lockscreen = true, onSuccess?: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().startCharging(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess?.();
        } else {// TODO: error handling
          onFail?.(response.error);
        }
      });
    },

    async stopCharging(lockscreen = true, onSuccess?: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().stopCharging(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess?.();
        } else {// TODO: error handling
          onFail?.(response.error);
        }
      });
    },

    //???
    setTokens(responseDate: RequestResponse<Jwt, ErrorData<EvServiceApplicationError>>) {
      if (responseDate.data) {
        setTokens(responseDate.data.access_token.token,responseDate.data.refresh_token.token);
      } else {
        //TODO: toast - log in error
      }
    },
  },

  getters: {
    getChargingSessionUrl(): string{
      return this.chargingSessionUrl;
    },
    getSessionInfo(): SessionInfo | undefined {
      return this.sessionInfo;
    },
  }
});
