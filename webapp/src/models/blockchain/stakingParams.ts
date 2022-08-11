import { PaginatedResponse } from "@/models/blockchain/pagination";

export interface Params{
    unbonding_time: string,
    max_validators: number,
    max_entries: number,
    historical_entries: number,
    bond_denom: string
}

export interface StakingParamsResponse{
  params: Params;
}

