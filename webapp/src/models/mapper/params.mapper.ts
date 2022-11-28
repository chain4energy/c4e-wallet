import { Params as bcParams } from "@/models/blockchain/stakingParams";
import { Params, Params as StoreParams } from "@/models/store/params";

export function mapParams( params : bcParams | undefined){
  if (params === undefined) {
    throw new Error('params is undefined');
  }
  const result = mapParameter(params);
  return { StoreParams : result };
}
export function mapParameter( params: bcParams | undefined): StoreParams{
  if (params === undefined) {
    throw new Error('Validator is undefined');
  }
  return new Params(params.unbonding_time, params.max_validators, params.max_entries, params.historical_entries, params.bond_denom);
}
