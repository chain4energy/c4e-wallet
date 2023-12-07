import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ErrorData} from "@/api/base.api";
import {DecodedLinkParamsType, DecodedLinkType, DecodeLinkAuthParams} from "@/ev/models/evServiceCommons";
import {useEvChargingSessionStore} from "@/ev/store/evChargingSession.store";
import {useEvChargePointConnectorStore} from "@/ev/store/evChargePointConnector.store";
import {EvServiceContext} from "@/ev/store/evServiceErrorHandler";
import {EvServiceApplicationError} from "@/ev/models/evServiceErrors";
import {ToastsTypeEnum} from "@/services/toasts/toasts-type.enum";
import {ToastsService} from "@/services/toasts/toasts.service";
import evServiceErrorHandler from "@/ev/store/evServiceErrorHandler"

interface EvCommonStoreState {
  loggedIn: boolean,
  appTypeLink: AppTypeLink | undefined,
  userEmail: string,
}

export enum AppTypeLink {
  CHARGE_POINT_CONNECTOR_LINK,
  CHARGING_SESSION_LINK
}

export const useEvCommonStore = defineStore({
  id: 'evCommonStore',

  state: (): EvCommonStoreState => {
    return {
      loggedIn: false,
      appTypeLink: undefined,
      userEmail: '',
    };
  },
  actions: {
    async decodeLink(pathToDecode: string, lockscreen = true, onSuccess?: (() => void), onFail?: ((defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
      apiFactory.evServiceApi().evDecodeLink(pathToDecode, lockscreen).then(response => {
        if (response.isSuccess() && response.data) {
          if (response.data.type == DecodedLinkType.RESOURCE_LINK && response.data.params.type == DecodedLinkParamsType.CHARGE_POINT_CONNECTOR) {
            const chargingSessionStore = useEvChargePointConnectorStore();
            this.appTypeLink = AppTypeLink.CHARGE_POINT_CONNECTOR_LINK;
            chargingSessionStore.chargePointConnectorUrl = response.data.params.path;
            onSuccess?.();
          } else if (response.data.type == DecodedLinkType.AUTH_RESOURCE_LINK && response.data.params.type == DecodedLinkParamsType.CHARGING_SESSION) {
            const chargingSessionStore = useEvChargingSessionStore();
            this.appTypeLink = AppTypeLink.CHARGING_SESSION_LINK;
            chargingSessionStore.chargingSessionUrl = response.data.params.path;
            chargingSessionStore.chargingSessionResourceCode = (response.data.params as DecodeLinkAuthParams).resourceCode;
            onSuccess?.();
          } else {
            console.error("Resource link to supported. NOT IMPLEMENTED!!!");
            //TODO:
            ToastsService.getInstance().errorToast(ToastsTypeEnum.EV_SERVICE, 'Resource link to supported.', 1);
          }
        } else {
          evServiceErrorHandler.handleError(response.error,  EvServiceContext.DECODE_RESOURCE_LINK, onFail);
        }
      });
    }
  },
  getters: {
    getAppLinkType(): AppTypeLink | undefined {
      return this.appTypeLink;
    }
  }
});
