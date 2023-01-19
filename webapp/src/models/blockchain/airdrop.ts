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
  campaignId: string,
  address: string,
  amount: Coin,
  completedMissions: string[],
  claimedMissions: string[]
}

export interface Campaign {
  id: string,
  owner: string,
  name: string,
  description: string,
  enabled: boolean,
  start_time: string,
  end_time: string,
  lockup_period: string,
  vesting_period: string
}

export interface CampaignsInfo {
  campaign: Campaign[],
  pagination: Pagination

}

export interface Mission {
  id: string,
  campaign_id: string,
  name: string,
  description: string,
  missionType: MissionType,
  weight: number
}

export interface MissionsInfo {
  mission: Mission[],
  pagination: Pagination
}


export enum MissionType {
  INITIAL_CLAIM = 'INITIAL_CLAIM',
  VOTE = 'VOTE',
  DELEGATE = 'DELEGATE',
}

