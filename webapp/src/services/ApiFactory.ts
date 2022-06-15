import {ActiveValidatorsApi} from "@/services/active-validators.api";

class ApiFactory {

  private static instance: ApiFactory;

  private readonly _activeValidatorsService = new ActiveValidatorsApi();

  private constructor() {
 //
  }

  public static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  public activeValidatorsApi(): ActiveValidatorsApi{
    return this._activeValidatorsService;
  }

}

export default ApiFactory.getInstance();

