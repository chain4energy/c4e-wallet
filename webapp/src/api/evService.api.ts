import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from "@/models/request-response";
import {Jwt} from "@/models/user/jwt";
import {
  DecodeLinkAuthParams,
  EvServiceApplicationError,
  InitPaymentRequest,
  LinkDecoder,
  LoginAuthRequest,
  QrCodeInfoParams,
  StartChargingAnonumousRequest,
  StartChargingAnonumousResponse
} from "@/models/ev/evServiceCommons";
import {ChargePointInfo} from "@/models/ev/chargerInfo";
import {SessionInfo} from "@/models/ev/sessionInfo";
import {CreateAccountRequest, PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {AccountInfo} from "@/models/user/accountInfo";
import {formatString} from "@/utils/string-formatter";
import {ChargePoint} from "@/models/ev/chargePoint";
import {CreateChargePoint} from "@/models/ev/createChargePoint";
import {UpdateChargePoint} from "@/models/ev/updateChargePoint";
import {UpdateChargePointConnector} from "@/models/ev/updateChargePointConnector";
import {ChargePointConnector} from "@/models/ev/chargePointConnector";
import {CreateChargePointConnector} from "@/models/ev/createChargePointConnector";
import {CreateTariff} from "@/models/ev/createTariff";
import {Tariff} from "@/models/ev/tariff";
import {UpdateTariffGroup} from "@/models/ev/updateTariffGroup";
import {CreateTariffGroup} from "@/models/ev/createTariffGroup";
import {TariffGroup} from "@/models/ev/tariffGroup";
import {ChargePointDict} from "@/models/ev/chargePointDict";


export class EvServiceApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.EV_SERVICE_API;
  }

  private evServicePostCall<R, T, E>(evServiceUrlPart: string, data: R, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.evServiceURL + evServiceUrlPart,
        data: data
      },
      lockscreen,
      null,
      logPrefix
    );
  }

  private evServiceEmptyPostCall<T, E>(evServiceUrlPart: string, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'POST',
        url: useConfigurationStore().config.evServiceURL + evServiceUrlPart
      },
      lockscreen,
      null,
      logPrefix
    );
  }

  private evServiceGetCall<T, E>(evServiceUrlPart: string, lockscreen: boolean, logPrefix: string): Promise<RequestResponse<T, ErrorData<E>>> {
    return this.axiosCall<T, E>({
        method: 'GET',
        url: useConfigurationStore().config.evServiceURL + evServiceUrlPart
      },
      lockscreen,
      null,
      logPrefix
    );
  }

  // public evLoginEmail(){
  //   const url = formatString(useConfigurationStore().config.queries ,{address: accountAddress});
  // }

  public evLoginWithResource(authRequest: LoginAuthRequest, lockscreen: boolean) {
    return this.evServicePostCall<LoginAuthRequest, Jwt, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.LOGIN_WITH_RESOURCE, authRequest, lockscreen, "activateEmailAccount");
  }

  public async authEmailAccount(emailAccount: PasswordAuthenticateRequest, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<EvServiceApplicationError>>> {
    return this.evServicePostCall<PasswordAuthenticateRequest, Jwt, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.LOGIN_WITH_EMAIL_PASSWORD, emailAccount, lockscreen, "authEmailAccount");
  }

  public async createEmailAccount(createAccountRequest: CreateAccountRequest, lockscreen: boolean): Promise<RequestResponse<AccountInfo, ErrorData<EvServiceApplicationError>>> {
    return this.evServicePostCall<PasswordAuthenticateRequest, AccountInfo, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.EMAIL_CREATE_ACCOUNT, createAccountRequest, lockscreen, "createEmailAccount");
  }

  public async activateEmailAccount(code: string, lockscreen: boolean): Promise<RequestResponse<Jwt, ErrorData<EvServiceApplicationError>>> {
    return this.evServiceGetCall<Jwt, EvServiceApplicationError>(formatString(useConfigurationStore().config.queriesEv.ACTIVATE_ACCOUNT, {activationCode: code}), lockscreen, "activateEmailAccount");
  }

  public evDecodeLink(path: string, lockscreen: boolean) {
    return this.evServiceGetCall<LinkDecoder<DecodeLinkAuthParams>, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + "/v0.1/link/" + path, lockscreen, "evDecodeLink");
  }

  public evQrCodeInfo(path: string, lockscreen: boolean) {
    return this.evServiceGetCall<LinkDecoder<QrCodeInfoParams>, EvServiceApplicationError>(path, lockscreen, "evQrCodeInfo");
  }

  public evChargePointInfo(path: string, lockscreen: boolean) {
    return this.evServiceGetCall<ChargePointInfo, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path, lockscreen, "evChargePointInfo");
  }

  public prepare(path: string, login: string, lockscreen: boolean) {
    return this.evServicePostCall<StartChargingAnonumousRequest, StartChargingAnonumousResponse, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path + "/session/prepare_anonymous", {login}, lockscreen, "evChargePointInfo");
  }

  public evFetchSesisonInfo(path: string, login: string, lockscreen: boolean) {
    return this.evServiceGetCall<SessionInfo, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path, lockscreen, "evFetchSesisonInfo");
  }

  public initPayment(path: string, initPaymentRequest: InitPaymentRequest, lockscreen: boolean) {
    return this.evServicePostCall<InitPaymentRequest, StartChargingAnonumousResponse, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path + "/init_payment", initPaymentRequest, lockscreen, "initPayment");
  }

  public startCharging(path: string, lockscreen: boolean) {
    return this.evServiceEmptyPostCall<StartChargingAnonumousResponse, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path + "/start_charging", lockscreen, "start_charging");
  }

  public stopCharging(path: string, lockscreen: boolean) {
    return this.evServiceEmptyPostCall<StartChargingAnonumousResponse, EvServiceApplicationError>(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + path + "/stop_charging", lockscreen, "stop_charging");
  }

  public getChargePointDicts(lockscreen: boolean): Promise<RequestResponse<ChargePointDict[], ErrorData<EvServiceApplicationError>>> {
    const url = useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point_dictionary';
    return this.evServiceGetCall<ChargePointDict[], EvServiceApplicationError>(url, lockscreen, "getChargePointDicts");
  }

  public getChargePoints(lockscreen: boolean): Promise<RequestResponse<ChargePoint[], ErrorData<EvServiceApplicationError>>> {
    const url = useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point';
    return this.evServiceGetCall<ChargePoint[], EvServiceApplicationError>(url, lockscreen, "getChargePoints");
  }

  public createChargePoint(createChargePoint: CreateChargePoint, lockscreen: boolean): Promise<RequestResponse<ChargePoint, ErrorData<EvServiceApplicationError>>> {
    const url = useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point';
    return this.evServicePostCall<CreateChargePoint, ChargePoint, EvServiceApplicationError>(url, createChargePoint, lockscreen, "createChargePoint");
  }

  public updateChargePoint(cpId: string, updateChargePoint: UpdateChargePoint, lockscreen: boolean): Promise<RequestResponse<ChargePoint, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point/{cpId}', {cpId});
    return this.evServicePostCall<UpdateChargePoint, ChargePoint, EvServiceApplicationError>(url, updateChargePoint, lockscreen, "updateChargePoint");
  }

  public deleteChargePoint(cpId: string, lockscreen: boolean): Promise<RequestResponse<void, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point/{cpId}', {cpId});
    return this.evServiceEmptyPostCall<void, EvServiceApplicationError>(url, lockscreen, "deleteChargePoint");
  }

  public createChargePointConnector(cpId: string, createChargePointConnector: CreateChargePointConnector, lockscreen: boolean): Promise<RequestResponse<ChargePointConnector, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point/{cpId}/connector', {cpId});
    return this.evServicePostCall<CreateChargePointConnector, ChargePointConnector, EvServiceApplicationError>(url, createChargePointConnector, lockscreen, "createChargePointConnector");
  }

  public getChargePointConnectors(cpId: string, lockscreen: boolean): Promise<RequestResponse<ChargePointConnector[], ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point/{cpId}/connector', {cpId});
    return this.evServiceGetCall<ChargePointConnector[], EvServiceApplicationError>(url, lockscreen, "getChargePointConnectors");
  }

  public updateChargePointConnector(cpId: string, connectorId: number, updateChargePointConnector: UpdateChargePointConnector, lockscreen: boolean): Promise<RequestResponse<ChargePointConnector, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point/{cpId}/connector/{connectorId}', {
      cpId,
      connectorId
    });
    return this.evServicePostCall<UpdateChargePointConnector, ChargePointConnector, EvServiceApplicationError>(url, updateChargePointConnector, lockscreen, "updateChargePointConnector");
  }

  public deleteChargePointConnector(cpId: string, connectorId: number, lockscreen: boolean): Promise<RequestResponse<void, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/charge_point/{cpId}/connector/{connectorId}', {
      cpId,
      connectorId
    });
    return this.evServiceEmptyPostCall<void, EvServiceApplicationError>(url, lockscreen, "deleteChargePointConnector");
  }

  public getTariffGroups(lockscreen: boolean): Promise<RequestResponse<TariffGroup[], ErrorData<EvServiceApplicationError>>> {
    const url = useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group';
    return this.evServiceGetCall<TariffGroup[], EvServiceApplicationError>(url, lockscreen, "getTariffGroups");
  }

  public createTariffGroup(createTariffGroup: CreateTariffGroup, lockscreen: boolean): Promise<RequestResponse<TariffGroup, ErrorData<EvServiceApplicationError>>> {
    const url = useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group';
    return this.evServicePostCall<CreateTariffGroup, TariffGroup, EvServiceApplicationError>(url, createTariffGroup, lockscreen, "createTariffGroup");
  }

  public updateTariffGroup(updateTariffGroup: UpdateTariffGroup, lockscreen: boolean): Promise<RequestResponse<TariffGroup, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group/{tgId}', updateTariffGroup);
    return this.evServicePostCall<UpdateTariffGroup, TariffGroup, EvServiceApplicationError>(url, updateTariffGroup, lockscreen, "updateTariffGroup");
  }

  public deleteTariffGroup(tgId: number, lockscreen: boolean): Promise<RequestResponse<void, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group/{tgId}', {tgId});
    return this.evServiceEmptyPostCall<void, EvServiceApplicationError>(url, lockscreen, "deleteTariffGroup");
  }

  public getTariffs(tgId: number, lockscreen: boolean): Promise<RequestResponse<Tariff[], ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group/{tgId}/tariff', {tgId});
    return this.evServiceGetCall<Tariff[], EvServiceApplicationError>(url, lockscreen, "getTariffs");
  }

  public getAllTariffs(lockscreen: boolean): Promise<RequestResponse<Tariff[], ErrorData<EvServiceApplicationError>>> {
    const url = useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff';
    return this.evServiceGetCall<Tariff[], EvServiceApplicationError>(url, lockscreen, "getAllTariffs");
  }

  public createTariff(createTariff: CreateTariff, lockscreen: boolean): Promise<RequestResponse<Tariff, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group/{tgId}/tariff', createTariff);
    return this.evServicePostCall<CreateTariff, Tariff, EvServiceApplicationError>(url, createTariff, lockscreen, "createTariff");
  }

  public updateTariff(updateTariff: UpdateTariff, lockscreen: boolean): Promise<RequestResponse<Tariff, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group/{tgId}/tariff/{tId}', updateTariff);
    return this.evServicePostCall<UpdateTariff, Tariff, EvServiceApplicationError>(url, updateTariff, lockscreen, "updateTariff");
  }

  public deleteTariff(tgId: number, tId: number, lockscreen: boolean): Promise<RequestResponse<void, ErrorData<EvServiceApplicationError>>> {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group/{tgId}/tariff/{tId}', {
      tgId,
      tId
    });
    return this.evServiceEmptyPostCall<void, EvServiceApplicationError>(url, lockscreen, "deleteTariff");
  }

  async getTariffGroup(tgId: number, lockscreen: boolean) {
    const url = formatString(useConfigurationStore().config.queriesEv.CENTRAL_SYSTEM_SERVICE + '/v0.1/tariff_group/{tgId}', {tgId});
    return this.evServiceGetCall<void, EvServiceApplicationError>(url, lockscreen, "getTariffGroup");
  }
}
