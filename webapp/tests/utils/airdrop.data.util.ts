import {
  AirdropEntry,
  CampaignBc,
  MissionsInfo,
  MissionType,
  UserAirdropEntry,
  UserAirdropInfo
} from "@/models/blockchain/airdrop";
import {Coin} from "@/models/blockchain/common";
import {Block} from "@/models/store/block";
import {defaultDenom} from "./common.blockchain.data.util";

export function createUserEntriesResponse(){
  return{
    user_entry: {
      address: 'c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55',
      claim_records: [{
        campaign_id: '1',
        address: 'c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55',
        airdrop_coins: [{
          denom: 'uc4e',
          amount: '1000000',
        }],
        amount: [{
          denom: 'uc4e',
          amount: '1000000',
        }],
        completedMissions: ['0', '1'],
        claimedMissions: ['2'],
      }]
    }
  };
}

export function createCampaignResponse(){
  return{
    campaign:{
      id: '0',
      owner: 'c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55',
      name: 'some name',
      description: 'some description',
      feegrant_amount: '10000',
      initial_claim_free_amount: '10000',
      enabled: true,
      start_time: '2023-05-23T15:52:59.351243250Z',
      end_time: '2023-07-23T15:52:59.351243250Z',
      lockup_period: '',
      vesting_period: '',
      vestingPoolName: '',
      campaign_total_amount: {
        denom: 'uc4e',
        amount: '1000000',
      },
      campaign_current_amount: {
        denom: 'uc4e',
        amount: '1000000',
      },
    }
  };
}

export function createMissionsResponse(){
  return{
    missions: [
      {
        id: '0',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.INITIAL_CLAIM,
        weight: '0.100000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '1',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.CLAIM,
        weight: '0.200000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '2',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.VOTE,
        weight: '0.200000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '3',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.DELEGATE,
        weight: '0.200000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '4',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.CLAIM,
        weight: '0.300000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      }
    ]
  };
}
export function createMissionsResponseWeightErr(){
  return{
    missions: [
      {
        id: '0',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.INITIAL_CLAIM,
        weight: '0.100000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '1',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.CLAIM,
        weight: '0.200000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '2',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.VOTE,
        weight: '0.200000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '3',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.DELEGATE,
        weight: '0.300000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      },
      {
        id: '4',
        campaign_id: '1',
        name: 'test',
        description: 'test',
        missionType: MissionType.CLAIM,
        weight: '0.300000000000000000',
        claim_start_date: '2023-05-23T15:52:59.351243250Z'
      }
    ]
  };
}

export const defaultCampaignList = [
  {
    id: '0',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.INITIAL_CLAIM,
    weight: '0.100000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '1',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.CLAIM,
    weight: '0.200000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '2',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.VOTE,
    weight: '0.200000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '3',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.DELEGATE,
    weight: '0.200000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '4',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.CLAIM,
    weight: '0.300000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  }
];

export const defaultCampaignListWithErr = [
  {
    id: '0',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.INITIAL_CLAIM,
    weight: '0.100000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '1',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.CLAIM,
    weight: '0.200000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '2',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.VOTE,
    weight: '0.200000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '3',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.DELEGATE,
    weight: '0.300000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  },
  {
    id: '4',
    campaign_id: '1',
    name: 'test',
    description: 'test',
    missionType: MissionType.CLAIM,
    weight: '0.300000000000000000',
    claim_start_date: '2023-05-23T15:52:59.351243250Z'
  }
];

export function expectUserEntry(userEntry: UserAirdropInfo | undefined){
  expect(userEntry).not.toBeUndefined();
}

export function expectCampaignEntry(campaign:CampaignBc | undefined){
  expect(campaign).not.toBeUndefined();
}
export function expectCampaignMissions(missions:  MissionsInfo | undefined){
  expect(missions).not.toBeUndefined();
  expect(missions?.missions.length).toBe(5);
  let totalWeight= 0
  missions?.missions.forEach((el)=>{
    const defaultMission = defaultCampaignList.find(element => element.id === el.id);
    expect(defaultMission).not.toBeUndefined();
    if(defaultMission){
      expect(el.id).toBe(defaultMission.id);
      expect(el.campaign_id).toBe(defaultMission.campaign_id);
      expect(el.missionType).toBe(defaultMission.missionType);
      expect(el.name).toBe(defaultMission.name);
      expect(el.weight).toBe(defaultMission.weight);
      totalWeight += Number(el.weight);
      expect(el.claim_start_date).toBe(defaultMission.claim_start_date);
      expect(el.description).toBe(defaultMission.description);
    }

  });
  expect(totalWeight).toBe(1);
}

export function expectCampaignMissionsWeightErr(missions:  MissionsInfo | undefined){
  expect(missions).not.toBeUndefined();
  expect(missions?.missions.length).toBe(5);
  let totalWeight= 0;
  missions?.missions.forEach((el)=>{
    const defaultMission = defaultCampaignListWithErr.find(element => element.id === el.id);
    expect(defaultMission).not.toBeUndefined();
    if(defaultMission){
      expect(el.id).toBe(defaultMission.id);
      expect(el.campaign_id).toBe(defaultMission.campaign_id);
      expect(el.missionType).toBe(defaultMission.missionType);
      expect(el.name).toBe(defaultMission.name);
      expect(el.weight).toBe(defaultMission.weight);
      totalWeight += Number(el.weight);
      expect(el.claim_start_date).toBe(defaultMission.claim_start_date);
      expect(el.description).toBe(defaultMission.description);
    }

  });
  expect(totalWeight).not.toBeLessThan(1);
}
