import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ChargePointInfo} from "@/models/ev/chargerInfo";
import {AuthResponse} from "@/models/ev/evServiceCommons";

interface EvStoreState {
  chargePointInfo: ChargePointInfo | undefined,
  qrCodeInfoPath: string
  sessionPath: string
  resourceCode: string
  email: string
}

export const useEvStore = defineStore({
  id: 'evStore',
  state: (): EvStoreState => {
    return {
      chargePointInfo: undefined,
      qrCodeInfoPath: "",
      sessionPath: "",
      resourceCode: "",
      email: ""
    };
  },
  actions: {
    async getEvAuthResource(pathToDecode: string, lockscreen = true) {
      await apiFactory.evServiceApi().evDecodeLink(pathToDecode, lockscreen).then(response => {
        if (response.data) {
          const authResponse = decodeParamsMapToAuthResponse(response.data.params);
          this.sessionPath = authResponse.path;
          this.resourceCode = authResponse.resourceCode;
        }
      });
    },

    // TODO: probably move to another store / api or use another store or api to save jwt
    async loginWithResource(lockscreen = true) {
      await apiFactory.evServiceApi().evLoginWithResource({
        resourceCode: this.resourceCode
      }, lockscreen).then(response => {
        if (response.data) {
          const jwt = response.data.access_token;
        }
      });
    },

    async mockGetQrCodeInfo(qrCodeInfoPath: string) {
      this.qrCodeInfoPath = qrCodeInfoPath;
    },

    async getQrCodeInfo(pathToDecode: string, lockscreen = true) {
      await apiFactory.evServiceApi().evQrCodeInfo(pathToDecode, lockscreen).then(response => {
        if (response.data) {
          this.qrCodeInfoPath = response.data.params.get("path") ?? ""
        }
      });
    },

    async mockFetchChargePointInfo(chargePointId: string, connectorId: number, lockscreen = true) {
      await apiFactory.evServiceApi().evChargePointInfo(`/v0.1/charge_point/${chargePointId}/connector/${connectorId}`, lockscreen).then(response => {
        if (response.data) {
          console.log(response.data)
          this.chargePointInfo = response.data
        }
      });
    },

    async fetchChargePointInfo(lockscreen = true) {
      await apiFactory.evServiceApi().evChargePointInfo(this.qrCodeInfoPath, lockscreen).then(response => {
        if (response.data) {
          this.chargePointInfo = response.data
        }
      });
    },

    async startChargingSession(lockscreen = true) {
      await apiFactory.evServiceApi().startCharging(this.qrCodeInfoPath, lockscreen).then(response => {
        if (response.isSuccess()) {
          //TODO: add currect alert to check email
          alert("Charging session started, check your email to continue");
        }
      });
    },
  },
  getters: {
    getChargePointInfo(): ChargePointInfo | undefined {
      return this.chargePointInfo;
    },
  }
});

const decodeParamsMapToAuthResponse = (params: Map<string, string>): AuthResponse => {
  return {
    path: params.get("path") ?? "",
    resourceCode: params.get("resourceCode") ?? ""
  }
};
