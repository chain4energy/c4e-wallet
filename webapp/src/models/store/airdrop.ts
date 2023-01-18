import {Coin, DecCoin} from "@/models/store/common";

export class AirdropTotal{
  campaignAllocations: CampaignAllocation[]
  constructor(campaignAllocations: CampaignAllocation[]) {
    this.campaignAllocations = campaignAllocations;
  }
  public getTotal(){
    const sumArr = Array<number>();
    this.campaignAllocations.forEach((el)=> {
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
  constructor(name: string, details_url: string, is_absent:boolean, hide_if_absent:boolean, allocations: AlocationsSt[]) {
    this.name = name;
    this.details_url = details_url;
    this.is_absent = is_absent;
    this.hide_if_absent = hide_if_absent;
    this.allocations = allocations;
  }
  public getTotalForCampaign(){
    const sum = Array<number>();
    this.allocations.forEach((el) => {
      sum.push(el.value);
    });
    return sum.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  public hideCampaign():boolean{
    return this.is_absent && this.hide_if_absent;
  }
}

export class AlocationsSt{
  name: string;
  value: number;
  constructor(name : string, value: number) {
    this.name = name;
    this.value = value;
  }
}

export class Campaign{
  "id" : string;
  "name" : string;
  "description" : string;
  "enabled": boolean;
  "start_time": string;
  "end_time": string;
  "lockup_period": string;
  "vesting_period": string;
  "amount": Coin;
  "missions": Mission[];
}

export class Mission {
  "id" : string;
  "name" : string;
  "description" : string;
  "mission_type" : MissionType;

  "weight": number;
  "completed" : boolean;
  "claimed" : boolean;
  "claimed_time" : string
}

export enum MissionType {
  INITIAL_CLAIM,
  VOTE

}
