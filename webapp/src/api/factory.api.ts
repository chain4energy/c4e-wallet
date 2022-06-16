import {ValidatorsApi} from "@/api/validators.api";
import {TokensApi} from "@/api/tokensApi";
import {BlockApi} from "@/api/block.api";
import {ProposalsApi} from "@/api/proposals.api";

class ApiFactory {

  private static instance: ApiFactory;

  private readonly _validatorsApi = new ValidatorsApi();
  private readonly _tokensApi = new TokensApi();
  private readonly _blockApi = new BlockApi();
  private readonly _proposalsApi = new ProposalsApi();
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
  public tokensApi(): TokensApi{
    return this._tokensApi;
  }
  public blockApi(): BlockApi {
    return this._blockApi;
  }
  public proposalsApi(): ProposalsApi {
    return this._proposalsApi;
  }
}

export default ApiFactory.getInstance();

