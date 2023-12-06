import {defineStore} from "pinia";
import {ChargePoint} from "@/ev/models/chargePoint";
import apiFactory from "@/api/factory.api";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/ev/models/evServiceCommons";

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
    async fetchChargePointConnectorAll( lockscreen = true) {
      await apiFactory.evServiceApi().getChargePointConnectorAll(this.chargePointConnectorUrl, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          console.log(JSON.stringify(response.data));
          this.chargePoint = response.data;
        } else {
          //TODO: error
        }
      });
    },
    async prepareSession(userEmail: string, lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().prepare(this.chargePointConnectorUrl, userEmail, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
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
