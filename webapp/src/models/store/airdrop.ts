import {Coin} from "@/models/store/common";
import {MissionType as MissionTypeBc} from "@/models/blockchain/airdrop";
import {BigDecimal} from "@/models/store/big.decimal";
import {useConfigurationStore} from "@/store/configuration.store";

export class AirdropTotal {
  campaignAllocations: CampaignAllocation[]

  constructor(campaignAllocations: CampaignAllocation[]) {
    this.campaignAllocations = campaignAllocations;
  }

  public getTotal() {
    const sumArr = Array<number>();
    this.campaignAllocations.forEach((el) => {
      sumArr.push(el.getTotalForCampaign());
    });
    const sum = sumArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum;
  }
}


export class CampaignAllocation {
  name: string;
  details_url: string;

  is_absent: boolean;
  hide_if_absent: boolean;
  allocations: AlocationsSt[];

  constructor(name: string, details_url: string, is_absent: boolean, hide_if_absent: boolean, allocations: AlocationsSt[]) {
    this.name = name;
    this.details_url = details_url;
    this.is_absent = is_absent;
    this.hide_if_absent = hide_if_absent;
    this.allocations = allocations;
  }

  public getTotalForCampaign() {
    const sum = Array<number>();
    this.allocations.forEach((el) => {
      sum.push(el.value);
    });
    return sum.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  public hideCampaign(): boolean {
    return this.is_absent && this.hide_if_absent;
  }
}

export class AlocationsSt {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}

export class Campaign{
  id : number;
  name : string;
  description : string;
  enabled: boolean;
  start_time: string;
  end_time: string;
  lockup_period: string;
  vesting_period: string;
  feegrant_amount: Coin;
  initial_claim_free_amount: string;
  amount: Coin;
  missions: Mission[];


  constructor(id: number, name: string, description: string, enabled: boolean, start_time: string, end_time: string, lockup_period: string, vesting_period: string, feegrant_amount: string, initial_claim_free_amount:string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.enabled = enabled;
    this.start_time = start_time;
    this.end_time = end_time;
    this.lockup_period = lockup_period;
    this.vesting_period = vesting_period;
    this.feegrant_amount = new Coin(BigInt(feegrant_amount), getDefaultDenom());
    this.initial_claim_free_amount = initial_claim_free_amount;
    this.amount = new Coin(BigInt(0), getDefaultDenom());
    this.missions = new Array<Mission>();
  }
}

export class Mission {
  id : string;
  name : string;
  description : string;
  mission_type : MissionTypeSt;

  weight: number;
  completed : boolean;
  claimed : boolean;
  claimed_time : string | undefined


  constructor(id: string, name: string, description: string, mission_type: MissionTypeSt, weight: number, completed: boolean, claimed: boolean, claimed_time: string | undefined) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.mission_type = mission_type;
    this.weight = weight;
    this.completed = completed;
    this.claimed = claimed;
    this.claimed_time = claimed_time;
  }
}

export enum MissionTypeSt {
  INITIAL_CLAIM = 'INITIAL_CLAIM',
  VOTE = 'VOTE',
  DELEGATE = 'DELEGATE',
  UNDEFINED = 'UNDEFINED'
}

export function convertMissionType(missionTypeBc: MissionTypeBc): MissionTypeSt {
  if (missionTypeBc) {
    switch (missionTypeBc) {
      case MissionTypeBc.DELEGATE:
        return MissionTypeSt.DELEGATE;
      case MissionTypeBc.INITIAL_CLAIM:
        return MissionTypeSt.INITIAL_CLAIM;
      case MissionTypeBc.VOTE:
        return MissionTypeSt.VOTE;
    }
  } else {
    console.log("missionTypeBc not defined");
    return MissionTypeSt.UNDEFINED;
  }
}

export function findMission(missions: Mission[], missionId: string): Mission | undefined {
  return missions.find(d => {
    return d.id == missionId;
  });
}

export function findCampaign(campaigns: Campaign[], campaignId: number): Campaign | undefined {
  return campaigns.find(d => {
    return d.id == campaignId;
  });
}
export class FairdropPollUsage {
  total:Coin;
  claimed:Coin;
  activeCampaigns:Coin;
  toClaim:Coin;
  claimedPercentage:BigDecimal;
  toClaimePercentage:BigDecimal;


  constructor(total: Coin, claimed: Coin, activeCampaigns: Coin, toClaim: Coin, claimedPercentage:BigDecimal,   toClaimPercentage:BigDecimal) {
    this.total = total;
    this.claimed = claimed;
    this.activeCampaigns = activeCampaigns;
    this.toClaim = toClaim;
    this.claimedPercentage = claimedPercentage;
    this.toClaimePercentage = toClaimPercentage;
  }
}

function getDefaultDenom():string{
  return useConfigurationStore().config.airdropDefaultDenom;
}
