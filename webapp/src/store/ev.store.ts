import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ChargePointInfo} from "@/models/chargerInfo";
import {setAuthTokens} from "axios-jwt";
import {SessionInfo, SessionState} from "@/models/sessionInfo";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {RequestResponse} from "@/models/request-response";
import {Jwt} from "@/models/user/jwt";
import {ErrorData} from "@/api/base.api";
import {DecodedLinkParamsType, DecodedLinkType, DecodeLinkAuthParams, InitPaymentRequest} from "@/models/evServiceCommons";
import EvServiceErrorHandler, {EvServiceContext} from "@/store/evServiceErrorHandler";
import {ChargePointEvseStatusType} from "@/models/chargePointEvse";
import {ChargePoint} from "@/models/chargePoint";
import {EvServiceApplicationError} from "@/models/evServiceErrors";

interface EvStoreState {
  chargePointInfo: ChargePointInfo | undefined,
  sessionInfo: SessionInfo | undefined,
  qrCodeInfoPath: string,
  sessionInfoPath: string,
  resourceCode: string,
  userEmail: string,
  loggedIn: boolean,

  appTypeLink: AppTypeLink | undefined,
  chargePointConnectorUrl: string,
  chargingSessionUrl: string,
  chargingSessionResourceCode: string,
  connectorLiveStatus: ChargePointEvseStatusType | undefined,
  chargePoint: ChargePoint | undefined;

}

export enum AppTypeLink {
  CHARGE_POINT_CONNECTOR_LINK,
  CHARGING_SESSION_LINK
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
      userEmail: "",
      loggedIn: false,
      connectorLiveStatus: undefined,
      appTypeLink: undefined,
      chargePointConnectorUrl: "",
      chargingSessionResourceCode: "",
      chargingSessionUrl: "",
      chargePoint: undefined
    };
  },
  actions: {

    useWith(unauthorizedHandler : ()=>void){
      EvServiceErrorHandler.setUnauthorizedHandler(unauthorizedHandler);
      return this;
    },

    setSessionInfoState(sessionState: SessionState) {
      if (this.sessionInfo) {
        this.sessionInfo.state = sessionState;
      }
    },

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

    setTokens(responseDate: RequestResponse<Jwt, ErrorData<EvServiceApplicationError>>) {
      if (responseDate.data) {
        this.loggedIn = true;
        setAuthTokens({
          accessToken: responseDate.data.access_token.token,
          refreshToken: responseDate.data.refresh_token.token
        });
      } else {
        //TODO: toast - log in error
      }
    },

    // async refreshToken(){
    //   await apiFactory.evServiceApi().refreshToken()
    // },

    async getAccountInfo(onSuccess: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void), lockscreen = true) {
      await apiFactory.evServiceApi().getAccountInfo(lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          onSuccess();
        } else {
          onFail?.(responseDate.error);
        }
      });
    },

    async authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void), lockscreen = true) {
      await apiFactory.evServiceApi().authEmailAccount(emailAccount, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.userEmail = emailAccount.login;
          onSuccess();
        } else {
          if (onFail) {
            onFail(responseDate.error);
          } else {
            EvServiceErrorHandler.handleError(responseDate.error, EvServiceContext.LOG_IN);
          }
        }
      });
    },
    async createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void), lockscreen = true) {
      return await apiFactory.evServiceApi().createEmailAccount(createAccountRequest, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          onSuccess();
        } else {
          if (onFail) {
            onFail(responseDate.error);
          } else {
            EvServiceErrorHandler.handleError(responseDate.error, EvServiceContext.CREATE_ACCOUNT);
          }
        }
      });
    },
    async activateEmailAccount(code: string, onSuccess: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void), lockscreen = true) {
      await apiFactory.evServiceApi().activateEmailAccount(code, lockscreen).then(responseDate => {
        if (responseDate.isSuccess()) {
          this.setTokens(responseDate);
          // this.loginType = LoginTypeEnum.EMAIL;
          onSuccess();
        } else {
          if (onFail) {
            onFail(responseDate.error);
          } else {
            EvServiceErrorHandler.handleError(responseDate.error, EvServiceContext.ACTIVATE_EMAIL_ACCOUNT);
          }
        }
      });
    },

    async fetchChargePointConnectorAll(chargePointConnectorUrl: string, lockscreen = true) {
      await apiFactory.evServiceApi().getChargePointConnectorAll(chargePointConnectorUrl, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          console.log(JSON.stringify(response.data));
          this.chargePoint = response.data;
        } else {
          //TODO: error
        }
      });
    },

    async prepareSession(lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().prepareAnonymousSession(this.chargePointConnectorUrl, this.userEmail, "50", "EUR", lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
      });
    },


    async startCharging(lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().startCharging(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
      });
    },

    async stopCharging(lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      await apiFactory.evServiceApi().stopCharging(this.chargingSessionUrl, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
      });
    },

    async fetchSessionInfo(chargingSessionUrl: string, lockscreen = true) {
      await apiFactory.evServiceApi().getSessionInfo(chargingSessionUrl, lockscreen).then(response => {
        if (response.data) {
          this.sessionInfo = response.data;
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

    async decodeLink(pathToDecode: string, lockscreen = true, onSuccess?: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      apiFactory.evServiceApi().evDecodeLink(pathToDecode, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          if (response.data.type == DecodedLinkType.RESOURCE_LINK && response.data.params.type == DecodedLinkParamsType.CHARGE_POINT_CONNECTOR) {
            this.appTypeLink = AppTypeLink.CHARGE_POINT_CONNECTOR_LINK;
            this.chargePointConnectorUrl = response.data.params.path;
            onSuccess?.();
          } else if (response.data.type == DecodedLinkType.AUTH_RESOURCE_LINK && response.data.params.type == DecodedLinkParamsType.CHARGING_SESSION) {
            this.appTypeLink = AppTypeLink.CHARGING_SESSION_LINK;
            this.chargingSessionUrl = response.data.params.path;
            this.chargingSessionResourceCode = (response.data.params as DecodeLinkAuthParams).resourceCode;
            onSuccess?.();
          } else {
            console.error("NOT IMPLEMENTED");
            //TODO:
          }
        } else {
          onFail?.(response.error);
        }
      });
    }
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
    getAppLinkType(): AppTypeLink | undefined {
      return this.appTypeLink;
    },
    getConnectorLiveStatus(): ChargePointEvseStatusType | undefined {
      return this.connectorLiveStatus;
    },
    getChargePointConnectorUrl(): string | undefined {
      return this.chargePointConnectorUrl;
    },
    getChargingSessionUrl(): string | undefined {
      return this.chargingSessionUrl;
    },
  }
});
