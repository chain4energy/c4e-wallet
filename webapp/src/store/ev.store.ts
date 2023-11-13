import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ChargePointInfo} from "@/models/ev/chargerInfo";
import {AuthResponse} from "@/models/ev/evServiceCommons";
import {setAuthTokens} from "axios-jwt";
import {SessionInfo} from "@/models/ev/sessionInfo";

interface EvStoreState {
  chargePointInfo: ChargePointInfo | undefined,
  sessionInfo: SessionInfo | undefined,
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
      sessionInfo: undefined,
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

    async loginWithResource(lockscreen = true) {
      await apiFactory.evServiceApi().evLoginWithResource({
        resourceCode: this.resourceCode
      }, lockscreen).then(response => {
        if (response.data) {
          setAuthTokens({
            accessToken: response.data.access_token.token,
            refreshToken: response.data.refresh_token.token
          });
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

    async startChargingSession(lockscreen = true, onSuccess: (() => void)) {
      console.log(this.qrCodeInfoPath)
      await apiFactory.evServiceApi().startCharging( this.qrCodeInfoPath,this.email, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } // TODO: error handling
      });
    },
  },
  getters: {
    getChargePointInfo(): ChargePointInfo | undefined {
      return this.chargePointInfo;
    },
    getSessionInfo(): SessionInfo | undefined {
      return this.sessionInfo;
    },
  }
});

const decodeParamsMapToAuthResponse = (params: Map<string, string>): AuthResponse => {
  return {
    path: params.get("path") ?? "",
    resourceCode: params.get("resourceCode") ?? ""
  }
};
