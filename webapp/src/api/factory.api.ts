import {ValidatorsApi} from "@/api/validators.api";

class ApiFactory {

  private static instance: ApiFactory;

  private readonly _validatorsApi = new ValidatorsApi();

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

}

export default ApiFactory.getInstance();

