import {Pagination} from "@/models/blockchain/pagination";

export interface AirDropRes {
  data: airDrop,
  error: any
}

export interface airDrop {
  atom_staked_balance: string,
  atom_address: string,
  c4e_address: string,
  base_airdrop: number
  booster_1_airdrop: number,
  booster_2_airdrop: number,
  gleam_airdrop: number,
  total_amount: number,
  voted_on_proposal: boolean,
  atom_delegated_outside: number,
  delegated_outside: boolean
}

export interface ClaimRecord {
  address: string,
  claim_address: string,
  campaign_records: CampaignRecord[]
}

export interface CampaignRecord {
  claimable: number,
  campaign: Campaign,
  missions: Mission[]
}

export interface Mission {
  mission_id: string,
  description: string,
  weight: string,
  status: MissionStatus
}

export enum MissionStatus {
  INITIAL,
  COMPLETED,
  CLAIMED
}

export interface Campaign {
  campaign_id: string,
  enabled: boolean,
  start_time: Date,
  end_time: Date,
  lockup_period: string,
  vesting_period: string,
  description: string
}
