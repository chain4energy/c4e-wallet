import {ValidatorsApi} from "@/api/validators.api";
import {AccountApi} from "@/api/account.api";

class ApiFactory {

  private static instance: ApiFactory;

  private readonly _validatorsApi = new ValidatorsApi();
  private readonly _accountApi = new AccountApi()

  private constructor() {
 //
  }

  public static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  public validatorsApi(): ValidatorsApi{
    return this._validatorsApi;
  }
  public accountApi(): AccountApi{
    return this._accountApi;
  }

}

export default ApiFactory.getInstance();

