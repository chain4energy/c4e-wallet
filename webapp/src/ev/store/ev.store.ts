import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ChargePointInfo} from "@/ev/models/chargerInfo";
import {setAuthTokens} from "axios-jwt";
import {SessionInfo, SessionState} from "@/ev/models/sessionInfo";
import {routerEv} from "@/ev/router";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {UserServiceContext, UserServiceErrorHandler} from "@/store/errorsHandlers/userServiceErrorHandler";
import {RequestResponse} from "@/models/request-response";
import {Jwt} from "@/models/user/jwt";
import {ErrorData} from "@/api/base.api";
import {SaleServiceApplicationError} from "@/models/saleServiceCommons";
import {EvServiceApplicationError, InitPaymentRequest} from "@/ev/models/evServiceCommons";
import {LoginTypeEnum} from "@/store/userService.store";
import {EvServiceContext, EvServiceErrorHandler} from "@/store/errorsHandlers/uvServiceErrorHandler";

interface EvStoreState {
  chargePointInfo: ChargePointInfo | undefined,
  sessionInfo: SessionInfo | undefined,
  qrCodeInfoPath: string,
  sessionInfoPath: string,
  resourceCode: string,
  userEmail: string,
  loggedIn: boolean
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
      loggedIn: false
    };
  },
  actions: {

    setSessionInfoState(sessionState: SessionState){
      if(this.sessionInfo) {
        this.sessionInfo.state = sessionState;
      }
    },
    async getEvAuthResource(pathToDecode: string, lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined)=>void)) {
      await apiFactory.evServiceApi().evDecodeLink(pathToDecode, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          this.sessionInfoPath = response.data.params.path;
          this.resourceCode = response.data.params.resourceCode;
          onSuccess();
        }else{
          onFail(response.error);
        }
      });
    },

    async loginWithResource(lockscreen = true, onSuccess: (() => void)) {
      await apiFactory.evServiceApi().evLoginWithResource({
        resourceCode: this.resourceCode
      }, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          onSuccess();
        }
      });
    },

    setTokens(responseDate: RequestResponse<Jwt, ErrorData<EvServiceApplicationError>>){
      if(responseDate.data){
        this.loggedIn = true;
        setAuthTokens({
          accessToken: responseDate.data.access_token.token,
          refreshToken: responseDate.data.refresh_token.token
        });
      } else {
        //TODO: toast - log in error
      }
    },

    async authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: (() => void), onFail?: ((error:ErrorData<EvServiceApplicationError> | undefined) => void), lockscreen = true) {
      await apiFactory.evServiceApi().authEmailAccount(emailAccount, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          this.userEmail = emailAccount.login;
          onSuccess();
        } else {
          EvServiceErrorHandler.getInstance().handleError(responseDate.error, EvServiceContext.LOG_IN);
          onFail?.(responseDate.error);
        }
      });
    },
    async createEmailAccount(createAccountRequest: CreateAccountRequest, onSuccess: (() => void), onFail?: ((error:ErrorData<EvServiceApplicationError> | undefined) => void), lockscreen = true) {
      return await apiFactory.evServiceApi().createEmailAccount(createAccountRequest, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          onSuccess();
        } else {
          // UserServiceErrorHandler.getInstance().handleError( res.error, UserServiceContext.CREATE_ACCOUNT);
          onFail?.(responseDate.error);
        }
      });
    },
    async activateEmailAccount(code: string, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.evServiceApi().activateEmailAccount(code, lockscreen).then(responseDate => {
        if(responseDate.isSuccess()) {
          this.setTokens(responseDate);
          // this.loginType = LoginTypeEnum.EMAIL;
          onSuccess();
        } else {
          // UserServiceErrorHandler.getInstance().handleError(responseDate.error, UserServiceContext.ACTIVATE_EMAIL_ACCOUNT);
          // onFail?.();
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

    async mockFetchChargePointInfo(chargePointId: string, connectorId: number, lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined)=>void)) {
      await apiFactory.evServiceApi().evChargePointInfo(`/v0.1/charge_point/${chargePointId}/connector/${connectorId}`, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
          this.chargePointInfo = response.data
        } else {// TODO: error handling
          onFail(response.error);
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

    async prepareSession(lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined)=>void)) {
      await apiFactory.evServiceApi().prepare(this.qrCodeInfoPath, this.userEmail, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
      });
    },


    async startCharging(lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined)=>void)) {
      await apiFactory.evServiceApi().startCharging(this.sessionInfoPath, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
      });
    },

    async stopCharging(lockscreen = true, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined)=>void)) {
      await apiFactory.evServiceApi().stopCharging(this.sessionInfoPath, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
      });
    },

    async fetchSessionInfo(lockscreen = true) {
      await apiFactory.evServiceApi().evFetchSesisonInfo(this.sessionInfoPath, this.userEmail, lockscreen).then(response => {
        if (response.data) {
          this.sessionInfo = response.data
          if(!this.sessionInfo.cost){
            this.sessionInfo.cost = 0;
          }
          if(!this.sessionInfo.energyConsumed){
            this.sessionInfo.energyConsumed = 0;
          }
        } // TODO: error handling
      });
    },

    async initPayment( initPaymentRequest: InitPaymentRequest, lockscreen: boolean, onSuccess: (() => void), onFail: ((error: ErrorData<EvServiceApplicationError> | undefined)=>void)){
      await apiFactory.evServiceApi().initPayment(this.sessionInfoPath, initPaymentRequest, lockscreen).then(response => {
        if (response.isSuccess()) {
          onSuccess();
        } else {// TODO: error handling
          onFail(response.error);
        }
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
