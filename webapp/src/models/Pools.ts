import {Amount} from "@/models/TotalSupply";

export interface CommunityPool {
  pool: Array<Amount>
}

export interface StrategicReversePool {
  balance: Amount
}

export interface AirdropPool {
  balance: Amount
}
