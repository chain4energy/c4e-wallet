import {defineStore} from "pinia";
import {ChargePoint} from "@/models/chargePoint";
import apiFactory from "@/api/factory.api";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import evServiceErrorHandler, {EvServiceContext} from "@/store/evServiceErrorHandler";

interface EvChargePointEvseStoreState {
  chargePointEvseUrl : string,
  chargePoint: ChargePoint | undefined;
}

export const useEvChargePointEvseStore = defineStore({
  id: 'useEvChargePointEvseStore',

  state: (): EvChargePointEvseStoreState => {
    return {
      chargePointEvseUrl: "",
      chargePoint: undefined,
    };
  },
  actions: {
    async fetchChargePointConnectorAll( lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().getChargePointConnectorAll(this.chargePointEvseUrl, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          console.log(JSON.stringify(response.data));
          this.chargePoint = response.data;
          onSuccess?.();
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.CHARGE_POINT_INFO_FETCH, onFail);
        }
      });
    },
    async prepareSession(userEmail: string, amount: string, currency:string ,lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().prepare(this.chargePointEvseUrl, userEmail, amount, currency, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess?.();
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.CHARGING_SESSION_PREPARE, onFail);
        }
      });
    },
  },
  getters: {
    getChargePoint(): ChargePoint | undefined{
      return this.chargePoint;
    },
    getChargePointEvseUrl(): string{
      return this.chargePointEvseUrl;
    }
  }
});
