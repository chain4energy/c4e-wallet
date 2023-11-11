import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ChargerInfo, ChargerStatus, ConnectorType} from "@/models/ev/chargerInfo";
import {AuthResponse, LoginAuthRequest} from "@/models/ev/evServiceCommons";

interface EvStoreState {
  chargerInfo: ChargerInfo | undefined,
  qrCodeInfoPath: string
  sessionPath: string
  resourceCode: string
}

export const useEvStore = defineStore({
  id: 'evStore',
  state: (): EvStoreState => {
    return {
      chargerInfo: undefined,
      qrCodeInfoPath: "",
      sessionPath: "",
      resourceCode: ""
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

    async getQrCodeInfo(pathToDecode: string, lockscreen = true) {
      this.qrCodeInfoPath = "/v0.1/charge_point/oko/connector/1";
      // TODO: implement, mocked for now
      // await apiFactory.evServiceApi().evQrCodeInfo(pathToDecode, lockscreen).then(response => {
      //   if (response.data) {
      //     this.qrCodeInfoPath = decodeParamsMapToQrCodePath(response.data.params)
      //   }
      // });
    },

    async getChargePointInfo(lockscreen = true) {
      await apiFactory.evServiceApi().evChargePointInfo(this.qrCodeInfoPath, lockscreen).then(response => {
        if (response.data) {
          this.chargerInfo = decodeParamsMapToChargerInfo(response.data.params)
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
    getChargerInfo(): ChargerInfo | undefined {
      return this.chargerInfo;
    },
  },
  persist: {
    enabled: true
  }
});

const decodeParamsMapToChargerInfo = (params: Map<string, string>): ChargerInfo => {
  const getEnumValue = <T>(enumType: any, value: string | undefined, defaultValue: T): T => {
    const numericValue = value !== undefined ? +value : -1;
    return numericValue in enumType ? enumType[numericValue] : defaultValue;
  };

  return {
    location: params.get("location") ?? "",
    name: params.get("name") ?? "",
    connectorType: getEnumValue(ConnectorType, params.get("connectorType"), ConnectorType.TYPE1),
    availability: params.get("availability") ?? "",
    status: getEnumValue(ChargerStatus, params.get("status"), ChargerStatus.AVAILABLE)
  }
};

const decodeParamsMapToQrCodePath = (params: Map<string, string>): string => {
  return params.get("path") ?? ""
};

const decodeParamsMapToAuthResponse = (params: Map<string, string>): AuthResponse => {
  return {
    path: params.get("path") ?? "",
    resourceCode: params.get("resourceCode") ?? ""
  }
};
