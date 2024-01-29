import {LoggedService} from "@/services/logged.service";
import {DataServiceInterface} from "@/services/data.service";
import {clearAuthTokens} from "axios-jwt/src/tokensUtils";
import {LogLevel} from "@/services/logger/log-level";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useEvStore} from "@/store/ev.store";
import {PasswordAuthenticateRequest} from "@/models/user/passwordAuth";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import apiFactory from "@/api/factory.api";
import {getAccessToken, getBrowserSessionStorage} from "axios-jwt";
import {applyStorage} from "axios-jwt/src/applyStorage";
import {goTo_EvOwnerDashboardView} from "@/router/goToRoute";

class OwnerEvService extends LoggedService implements DataServiceInterface {

  private static instance: OwnerEvService;
  private aaa = apiFactory.evServiceApi();

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.EV_OWNER_SERVICE_API;
  }

  public static getInstance(): OwnerEvService {
    if (!OwnerEvService.instance) {
      OwnerEvService.instance = new OwnerEvService();
    }
    return OwnerEvService.instance;
  }

  public async loginPageEntered() {
    this.logToConsole(LogLevel.DEBUG, 'loginPageLoaded');
    this.logToConsole(LogLevel.DEBUG, 'checking current session');
    if (await getAccessToken()) {
      await useEvStore().getAccountInfo(() => {
        this.logToConsole(LogLevel.DEBUG, 'session FOUND -> redirect to dashboard');
        goTo_EvOwnerDashboardView();
      }, () => {
        this.logToConsole(LogLevel.DEBUG, 'session NOT FOUND -> clearing tokens');
        this.clearJwtTokens();
      }, true);
    } else {
      this.logToConsole(LogLevel.DEBUG, 'no tokens is current session');
    }
  }

  public onConfigurationChange() {
    this.logToConsole(LogLevel.DEBUG, 'onConfigurationChange');
  }

  public async clearJwtTokens() {
    this.logToConsole(LogLevel.DEBUG, 'clearJwtTokens');
    await clearAuthTokens().then(() => {
      this.logToConsole(LogLevel.DEBUG, 'clearAuthTokens - DONE!!!');
    }).catch((e) => {
      this.logToConsole(LogLevel.DEBUG, 'clearAuthTokens - ERROR!!!', JSON.stringify(e));
    });
  }

  public authEmailAccount(emailAccount: PasswordAuthenticateRequest, onSuccess: (() => void), onFail?: ((error: ErrorData<EvServiceApplicationError> | undefined) => void), lockscreen = true) {
    useEvStore().authEmailAccount(emailAccount, onSuccess, onFail, lockscreen);
  }
}

export default OwnerEvService.getInstance();
