import {Coin} from "@/models/blockchain/common";
import {Pagination} from "@/models/blockchain/pagination";


export interface UserAirdropInfo {
  userAirdropEntries: UserAirdropEntry
}


export interface UserAirdropEntry {
  address: string,
  claim_address: string,
  airdrop_entries: AirdropEntry[]
}

export interface AirdropEntry {
  campaign_id: string,
  address: string,
  airdrop_coins: Coin[],
  amount: number,
  completedMissions: string[],
  claimedMissions: string[]
}

export interface CampaignBc {
  id: string,
  owner: string,
  name: string,
  description: string,
  feegrant_amount: string,
  initial_claim_free_amount: string,
  enabled: boolean,
  // denom: string,
  start_time: string,
  end_time: string,
  lockup_period: string,
  vesting_period: string
}

export interface CampaignsInfo {
  campaign: CampaignBc[],
  pagination: Pagination

}

export interface MissionBc {
  id: string,
  campaign_id: string,
  name: string,
  description: string,
  missionType: MissionType,
  weight: number
}

export interface MissionsInfo {
  mission: MissionBc[],
  pagination: Pagination
}


export enum MissionType {
  INITIAL_CLAIM = 'INITIAL_CLAIM',
  VOTE = 'VOTE',
  DELEGATE = 'DELEGATE',
}

export interface AirdropClaimsLeft {
  airdrop_coins: Coin[]
}

export interface AirdropDistributions {
  airdrop_coins: Coin[]
}

