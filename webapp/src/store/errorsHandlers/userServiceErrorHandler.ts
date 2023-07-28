import {SaleServiceApplicationError, SaleServiceApplicationErrorCodespace, SaleServiceApplicationErrorName} from "@/models/saleServiceCommons";
import {ErrorData} from "@/api/base.api";
import {ToastsService} from "@/services/toasts/toasts.service";
import {ToastsTypeEnum} from "@/services/toasts/toasts-type.enum";

export enum UserServiceContext {
  ANY,
  CREATE_ACCOUNT,
  LOG_IN,
  ACTIVATE_EMAIL_ACCOUNT,
  PARING_EMAIL_KEPLR
}

export class UserServiceErrorHandler {

  private static instance: UserServiceErrorHandler;
  toastService: ToastsService = ToastsService.getInstance();

  private constructor() {
    //singleton
  }

  public static getInstance(): UserServiceErrorHandler {
    if (!UserServiceErrorHandler.instance) {
      UserServiceErrorHandler.instance = new UserServiceErrorHandler();
    }
    return UserServiceErrorHandler.instance;
  }

  handleError(error?: ErrorData<SaleServiceApplicationError>, userServiceContext: UserServiceContext = UserServiceContext.ANY) {
    if (error) {
      if (error.data) {
        switch (userServiceContext) {
          case UserServiceContext.CREATE_ACCOUNT:
            this.handleAccountCreateError(error);
            break;
          case UserServiceContext.LOG_IN:
            this.handleLogInError(error);
            break;
          case UserServiceContext.ACTIVATE_EMAIL_ACCOUNT:
            this.handleActivateEmailAccountError(error);
            break;
          case UserServiceContext.PARING_EMAIL_KEPLR:
            this.handleParingEmailKeplrError(error);
            break;
          default:
            //UserServiceContext.ANY
            this.handleCommonServiceError(error);
        }
      } else {
        this.handleCommonNotServiceError(error);
      }
    } else {
      console.error("handleError - error undefined (shouldn't happen)");
    }
  }

  handleCommonNotServiceError(error: ErrorData<SaleServiceApplicationError>) {
    console.log("handleCommonNotServiceError" + JSON.stringify(error));
    let message = "Błąd podczas wykonywania operacji";//TODO: translate
    if (error.name == "AxiosError" && error.message == "Network Error") {
      message = "Błąd połaczenia sieciowego";//TODO: translate
    }
    this.toastService.errorToast(ToastsTypeEnum.PUBLIC_SALE_SERVICE, message, 1);
  }

  handleCommonServiceError(error: ErrorData<SaleServiceApplicationError>) {
    console.log("handleCommonServiceError" + JSON.stringify(error));
    const message = "Błąd podczas wykonywania operacji";//TODO: translate
    this.toastService.errorToast(ToastsTypeEnum.PUBLIC_SALE_SERVICE, message, 1);
  }

  handleAccountCreateError(error: ErrorData<SaleServiceApplicationError>) {
    console.debug("handleAccountCreateError" + JSON.stringify(error));
    const data = error.data;
    let message = "Błąd podczas tworzenia konta";//TODO: translate
    switch (data?.codespace) {
      case SaleServiceApplicationErrorCodespace.SERVICE:
        if (data.name == SaleServiceApplicationErrorName.SERVICE_ACCOUNT_ALREADY_EXISTS) {
          message = "Login już istnieje"; //TODO: translate
        }
        break;
      case SaleServiceApplicationErrorCodespace.AUTH:
        if (data.name == SaleServiceApplicationErrorName.AUTH_PASSWORD_TOO_SHORT) {
          message = "Podane hasło jest za krótkie"; //TODO: translate
        } else if (data.name == SaleServiceApplicationErrorName.AUTH_PASSWORD_NO_DIGIT) {
          message = "Podane hasło musi zawierać cyfrę"; //TODO: translate
        } else if (data.name == SaleServiceApplicationErrorName.AUTH_PASSWORD_NO_LETTER) {
          message = "Podane hasło musi zawierać literę"; //TODO: translate
        } else if (data.name == SaleServiceApplicationErrorName.AUTH_PASSWORD_NO_LOWERCASE) {
          message = "Podane hasło musi zawierać małą literę"; //TODO: translate
        } else if (data.name == SaleServiceApplicationErrorName.AUTH_PASSWORD_NO_UPPERCASE) {
          message = "Podane hasło musi zawierać wielką literę"; //TODO: translate
        } else if (data.name == SaleServiceApplicationErrorName.AUTH_PASSWORD_NO_SPECIAL_CHAR) {
          message = "Podane hasło musi zawierać znak zpecjalny"; //TODO: translate
        }
    }
    this.toastService.errorToast(ToastsTypeEnum.PUBLIC_SALE_SERVICE, message, 1);
  }

  handleLogInError(error: ErrorData<SaleServiceApplicationError>) {
    console.debug("handleLoginError" + JSON.stringify(error));
    const data = error.data;
    let message = "Błędny podczas logowania";//TODO: translate
    switch (data?.codespace) {
      case SaleServiceApplicationErrorCodespace.SERVICE:
        if (data.name == SaleServiceApplicationErrorName.SERVICE_LOGIN_FAILED) {
          message = "Nieprawidłowe dane logowania"; //TODO: translate
        } else if (data.name == SaleServiceApplicationErrorName.SERVICE_ACCOUNT_INACTIVE){
          message = "Konto jest nieaktywne";//TODO: translate
        }
    }
    this.toastService.errorToast(ToastsTypeEnum.PUBLIC_SALE_SERVICE, message, 1);
  }

  handleActivateEmailAccountError(error: ErrorData<SaleServiceApplicationError>) {
    console.debug("handleActivateEmailAccountError" + JSON.stringify(error));
    const data = error.data;
    let message = "Błędny podczas aktywacji konta";//TODO: translate
    switch (data?.codespace) {
      case SaleServiceApplicationErrorCodespace.SERVICE:
        if (data.name == SaleServiceApplicationErrorName.SERVICE_ACCOUNT_ACTIVATION_TIME_EXPIRED) {
          message = "Kod aktywacyjny stracił ważność."; //TODO: translate
        }
    }
    this.toastService.errorToast(ToastsTypeEnum.PUBLIC_SALE_SERVICE, message, 1);
  }

  handleParingEmailKeplrError(error: ErrorData<SaleServiceApplicationError>) {
    console.debug("handleParingEmailKeplrError" + JSON.stringify(error));
    const data = error.data;
    let message = "Błędny podczas parowania email to Keplr";//TODO: translate
    switch (data?.codespace) {
      case SaleServiceApplicationErrorCodespace.SERVICE:
        if (data.name == SaleServiceApplicationErrorName.SERVICE_ACCOUNT_PAIRING_TIME_EXPIRED) {
          message = "Kod parowania stracił ważność."; //TODO: translate
        }
    }
    this.toastService.errorToast(ToastsTypeEnum.PUBLIC_SALE_SERVICE, message, 1);
  }

}

