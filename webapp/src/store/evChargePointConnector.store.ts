import {defineStore} from "pinia";
import {ChargePoint} from "@/models/chargePoint";
import apiFactory from "@/api/factory.api";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import evServiceErrorHandler, {EvServiceContext} from "@/store/evServiceErrorHandler";

interface EvChargePointConnectorStoreState {
  chargePointConnectorUrl : string,
  chargePoint: ChargePoint | undefined;
}

export const useEvChargePointConnectorStore = defineStore({
  id: 'evChargePointConnectorStore',

  state: (): EvChargePointConnectorStoreState => {
    return {
      chargePointConnectorUrl: "",
      chargePoint: undefined,
    };
  },
  actions: {
    async fetchChargePointConnectorAll( lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().getChargePointConnectorAll(this.chargePointConnectorUrl, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          console.log(JSON.stringify(response.data));
          this.chargePoint = response.data;
          onSuccess?.();
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.CHARGE_POINT_INFO_FETCH, onFail);
        }
      });
    },
    async prepareSession(userEmail: string, lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().prepare(this.chargePointConnectorUrl, userEmail, lockscreen).then(response => {
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
    getChargePointConnectorUrl(): string{
      return this.chargePointConnectorUrl;
    }
  }
});
