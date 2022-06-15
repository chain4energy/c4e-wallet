import {ValidatorsApi} from "@/api/validators.api";
import {TokenomicsApi} from "@/api/tokenomics.api";

class ApiFactory {

  private static instance: ApiFactory;

  private readonly _validatorsApi = new ValidatorsApi();
  private readonly _tokenomicsApi = new TokenomicsApi();

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
  public tokenomicsApi(): TokenomicsApi{
    return this._tokenomicsApi;
  }

}

export default ApiFactory.getInstance();

