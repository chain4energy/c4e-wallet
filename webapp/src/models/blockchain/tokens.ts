import { Coin } from "./common";

export interface StakingPool {
  bonded_tokens: string;
  not_bonded_tokens: string;
}

export interface StakingPoolResponse {
  pool: StakingPool;
}

export interface SupplyResponse {
  amount: Coin;
}

export interface CommunityPoolResponse {
  pool: Coin[]
}

export interface InflationResponse {
  inflation: string;
}
