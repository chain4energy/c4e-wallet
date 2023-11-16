import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ChargePointInfo} from "@/models/ev/chargerInfo";
import {setAuthTokens} from "axios-jwt";
import {SessionInfo, SessionState} from "@/models/ev/sessionInfo";
import {routerEv} from "@/ev/router";

interface EvStoreState {
  chargePointInfo: ChargePointInfo | undefined,
  sessionInfo: SessionInfo | undefined,
  qrCodeInfoPath: string
  sessionInfoPath: string
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
      sessionInfoPath: "",
      resourceCode: "",
      email: ""
    };
  },
  actions: {
    async getEvAuthResource(pathToDecode: string, lockscreen = true) {
      await apiFactory.evServiceApi().evDecodeLink(pathToDecode, lockscreen).then(response => {
        if (response.data) {
          this.sessionInfoPath = response.data.params.path;
          this.resourceCode = response.data.params.resourceCode;
        }
      });
    },

    async loginWithResource(lockscreen = true, onSuccess: (() => void)) {
      await apiFactory.evServiceApi().evLoginWithResource({
        resourceCode: this.resourceCode
      }, lockscreen).then(response => {
        if (response.data) {
          setAuthTokens({
            accessToken: response.data.access_token.token,
            refreshToken: response.data.refresh_token.token
          });
          onSuccess();
        }
      });
    },

    async mockGetQrCodeInfo(qrCodeInfoPath: string) {
      this.qrCodeInfoPath = qrCodeInfoPath;
    },

    async getQrCodeInfo(pathToDecode: string, lockscreen = true) {
      await apiFactory.evServiceApi().evQrCodeInfo(pathToDecode, lockscreen).then(response => {
        if (response.data) {
          this.qrCodeInfoPath = response.data.params.path
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
      await apiFactory.evServiceApi().startCharging(this.qrCodeInfoPath, this.email, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } // TODO: error handling
      });
    },

    async fetchSessionInfo(lockscreen = true) {
      await apiFactory.evServiceApi().evFetchSesisonInfo(this.sessionInfoPath, this.email, lockscreen).then(response => {
        if (response.data) {
          this.sessionInfo = response.data
        } // TODO: error handling
      });
    },

    async fetchSessionInfoAndRedirect(lockscreen = true) {
      await this.fetchSessionInfo(lockscreen);
      await this.redirectBasedOnSessionState();
    },

    async redirectBasedOnSessionState() {
      if (this.sessionInfo) {
        //const router = useRouter();
        console.log(routerEv)
        switch (this.sessionInfo.state) {
          case SessionState.CREATED:
            routerEv.push({name: "ev_ChoosePaymentMethod"});
            break;
          case SessionState.ACCEPTED:
            routerEv.push({name: "ev_WaitForPaymentConfirmation"});
            break;
          case SessionState.PAID:
            routerEv.push({name: "ev_StartChargingSession"});
            break;
          case SessionState.REJECTED:
            routerEv.push({name: "ev_PaymentRejected"});
            break;
          case SessionState.STARTED:
            routerEv.push({name: "ev_SessionInfo"});
            break;
          case SessionState.FINISHED:
            routerEv.push({name: "ev_SessionInfo"});
            break;
        }
      }
    },
  },
  getters: {
    getChargePointInfo(): ChargePointInfo | undefined {
      return this.chargePointInfo;
    },
    getSessionInfo(): SessionInfo | undefined {
      return this.sessionInfo;
    },
    getQrCodeInfoPath(): string {
      return this.qrCodeInfoPath;
    },
    getSessionPath(): string {
      return this.sessionInfoPath;
    },
    getResourceCode(): string {
      return this.resourceCode;
    },
  }
});
