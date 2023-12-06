import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {ErrorData} from "@/api/base.api";
import {DecodedLinkParamsType, DecodedLinkType, DecodeLinkAuthParams, EvServiceApplicationError, InitPaymentRequest} from "@/ev/models/evServiceCommons";
import {useEvChargingSessionStore} from "@/ev/store/evChargingSession.store";
import {useEvChargePointConnectorStore} from "@/ev/store/evChargePointConnector.store";
interface EvCommonStoreState {
  loggedIn: boolean,
  appTypeLink: AppTypeLink | undefined,
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
    };
  },
  actions: {
    async decodeLink(pathToDecode: string, lockscreen = true, onSuccess?: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void)) {
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
    getAppLinkType(): AppTypeLink | undefined {
      return this.appTypeLink;
    }
  }
});
