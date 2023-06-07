import {Coin} from "@/models/blockchain/common";
import {Pagination} from "@/models/blockchain/pagination";


export interface UserAirdropInfo {
  user_entry: UserAirdropEntry
}


export interface UserAirdropEntry {
  address: string,
  //claim_address: string,
  claim_records: AirdropEntry[]
}

export interface AirdropEntry {
  campaign_id: string,
  address: string,
  airdrop_coins: Coin[],
  amount: Coin[],
  completedMissions: string[],
  claimedMissions: string[]
}

export interface CampaignBc {
  campaign:{
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
    vesting_period: string,
    vestingPoolName: string,
    campaign_total_amount: Coin[],
    campaign_current_amount: Coin[],
  }
}

export interface CampaignsInfo {
  campaigns: CampaignBc[],
  pagination: Pagination

}

export interface MissionBc {
  id: string,
  campaign_id: string,
  name: string,
  description: string,
  missionType: MissionType,
  weight: string,
  claim_start_date: string | undefined
}

export interface MissionsInfo {
  missions: MissionBc[],
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

