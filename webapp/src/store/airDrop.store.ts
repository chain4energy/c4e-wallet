import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {
  AirdropTotal,
  AlocationsSt,
  Campaign,
  CampaignAllocation,
  convertMissionType,
  Mission
} from "@/models/store/airdrop";
import {AllocationMapping, CampaignInfoDetails, CampainStatus} from "@/models/airdrop/airdrop";
import {RequestResponse} from "@/models/request-response";
import {ErrorData} from "@/api/base.api";
import {AirdropErrData, BlockchainApiErrorData} from "@/models/blockchain/common";

import {
  AirdropEntry,
  CampaignBc, CampaignBcCampaign,
  MissionBc, MissionsInfo,
  MissionType,
  UserAirdropEntry,
  UserAirdropInfo
} from "@/models/blockchain/airdrop";


import {Coin} from "@/models/store/common";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";

interface ISummary {
  totalAmount: Coin,
  activeCampaigns: Coin,
  totalClaimed: Coin,
  toClaim: Coin,
  claimedPercent?: BigDecimal,
  toClaimPercent?: BigDecimal
}

interface airDropState {
  claimRecord: UserAirdropEntry,
  airDropMock: AirdropTotal,
  campaigns: Campaign[],
  campaignIds: string[],
  airdropClaimingAddress: string,
  summary: ISummary,
}

export const useAirDropStore = defineStore({
  id: 'airDropStore',
  state: (): airDropState => {
    return {
      claimRecord: {} as UserAirdropEntry,
      airDropMock: Object(AirdropTotal),
      campaigns: Array<Campaign>(),
      airdropClaimingAddress: '',
      campaignIds: [],
      summary: {
        totalAmount: new Coin(BigInt(0), "uc4e"),
        activeCampaigns: new Coin(BigInt(0), "uc4e"),
        totalClaimed: new Coin(BigInt(0), "uc4e"),
        toClaim: new Coin(BigInt(0), "uc4e")
      },
    };
  },
  actions: {
    async sortEntries() {
      const result: Campaign[] = [];
      this.summary = {
        totalAmount: new Coin(BigInt(0), "uc4e"),
        activeCampaigns: new Coin(BigInt(0), "uc4e"),
        totalClaimed: new Coin(BigInt(0), "uc4e"),
        toClaim: new Coin(BigInt(0), "uc4e")
      };

      const presentSortedByMissions = Array<Campaign>();
      const futureSortedByMissions = Array<Campaign>();
      const pastSortedByMissions = Array<Campaign>();

      for (const el of this.campaigns) {
        this.summary.totalAmount.add(el.amount);
        el.missions.forEach(mission => {
          const missionAmount = mission.weightInPerc * Number(el.amount.amount) / 100;
          const missionAmountCoin = new Coin(BigInt(Math.floor(missionAmount)), el.amount.denom);
          if (mission.claimed) {
            this.summary.totalClaimed.add(missionAmountCoin);
          }
          if (el.status === CampainStatus.Now && !mission.claimed) {
            this.summary.toClaim.add(missionAmountCoin);
          }
        });

        if (el.status === CampainStatus.Now) {
          this.summary.activeCampaigns.add(el.amount);
          presentSortedByMissions.push(el);
        } else if (el.status === CampainStatus.Future) {
          futureSortedByMissions.push(el);
        } else if (el.status === CampainStatus.Past) {
          pastSortedByMissions.push(el);
        }
      }

      this.summary.toClaimPercent = getPercentage(this.summary.toClaim, this.summary.activeCampaigns);
      this.summary.claimedPercent = getPercentage(this.summary.totalClaimed, this.summary.totalAmount);

      const present = await this.sortCampaigns(presentSortedByMissions);
      const past = await this.sortCampaigns(pastSortedByMissions);
      const future = await this.sortCampaigns(futureSortedByMissions);

      if (present.length > 0) {
        present.forEach((el) => {
          result.push(el);
        });
      }
      if (future.length > 0) {
        future.forEach((el) => {
          result.push(el);
        });
      }
      if (past.length > 0) {
        past.forEach((el) => {
          result.push(el);
        });
      }

      this.campaigns = result;

    },
    async sortCampaigns(list: Campaign[]): Promise<Campaign[]> {
      return list.sort((a, b) => {
        return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
      });
    },

    async fetchAirdropTotal(address: string, lockscreen = true) {
      try {
        const response = await apiFactory.airDropApi().fetchAirdropsInfo(lockscreen);
        console.log(JSON.stringify(response));
        const promises = Array<Promise<RequestResponse<CampaignInfoDetails[], ErrorData<AirdropErrData>>>>();
        const campaignsList = Array<CampaignAllocation>();
        if (response.isSuccess() && response.data?.campaignInfoDetails) {
          const campaignInfoDetails = response.data.campaignInfoDetails;
          //create array with requests for particular airdrop
          campaignInfoDetails.forEach((campaign: CampaignInfoDetails) => {
            promises.push(apiFactory.airDropApi().fetchAirdrop(address, campaign.subfolder, lockscreen));
          });
          //wait for all requests
          const responseList = await Promise.all(promises);
          for (let i = 0; i < campaignInfoDetails.length; i++) {
            const campaign = campaignInfoDetails[i];
            const allocations = new Array<AlocationsSt>();
            campaign.allocationMapping.forEach((allocation: AllocationMapping) => {
              let mappedValue = 0;
              if (responseList && responseList[i].isSuccess()) {
                // TODO: Fix the TS error
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                mappedValue = responseList[i].data[allocation.mapping] as number;
              } else {
                console.log("Airdrop:\"" + campaign.name + "\" Allocation for address:" + address + " NOT FOUND.");
              }
              allocations.push(new AlocationsSt(allocation.name, mappedValue));
            });
            campaignsList.push(new CampaignAllocation(campaign.name, campaign.detailsUrl, !responseList[i].isSuccess(), campaign.hideIfAbsent, allocations));
            console.log("campaign:" + JSON.stringify(campaign));
          }
          //update data in store
          console.log("campaignsList:" + JSON.stringify(campaignsList));
          this.airDropMock = new AirdropTotal(campaignsList);
        }
      } catch (err) {
        console.error(err);
      }
    },

    async fetchUsersCampaignData(address: string, lockscreen = true) {
      this.claimRecord = {} as UserAirdropEntry;
      //TODO: Paging
      await apiFactory.airDropApi().fetchUserAirdropEntries(address, lockscreen).then(async (res: RequestResponse<UserAirdropInfo, ErrorData<BlockchainApiErrorData>>) => {
        if (res.isSuccess() && res.data) {
          this.claimRecord = res.data.user_entry;
          const campaignsList = this.claimRecord.claim_records;
          this.campaignIds = campaignsList.map(el => el.campaign_id);
          const promisesArray: Promise<Campaign>[] = [];
          for (const el of campaignsList) {
            promisesArray.push(this.fetchCampaign(el.campaign_id, el, lockscreen));
          }
          Promise.all(promisesArray).then(r => this.campaigns = r).then(this.sortEntries);
        }
        else {
          this.campaigns = new Array<Campaign>();
          await this.sortEntries();
        }
      });
    },

    async fetchCampaign(id: string, campaignData: AirdropEntry, lockscreen = true) {
      const checkCampaignStatus = (startTime: Date, endTime: Date) => {
        if(new Date(startTime).getTime() < new Date(Date.now()).getTime() && new Date(endTime).getTime()> new Date(Date.now()).getTime()){
          return CampainStatus.Now;
        }else if(new Date(startTime).getTime() > new Date(Date.now()).getTime()){
          return CampainStatus.Future;
        } else {
          return CampainStatus.Past;
        }
      };

      let camp = {} as Campaign;
      let campaign: CampaignBcCampaign;
      let missions: RequestResponse<MissionsInfo, ErrorData<BlockchainApiErrorData>>;

      await Promise.all([
        apiFactory.airDropApi().fetchCampaign(id, lockscreen).then(async (res: RequestResponse<CampaignBc, ErrorData<BlockchainApiErrorData>>) => {
          if (res.isSuccess() && res.data) {
            campaign = res.data.campaign;
          }
        }),
        apiFactory.airDropApi().fetchCampaignMissions(id, lockscreen).then(r => missions = r)
      ]).then(() => {
          const missionsList = Array<Mission>();
          let initialMission = {} as Mission;
          missions.data?.missions.forEach((el: MissionBc) =>{
            const completed = campaignData.completed_missions.find((mission)=>{
              return mission == el.id;
            });
            const claimed = campaignData.claimed_missions.find((mission)=>{
              return mission == el.id;
            });
            if(el.missionType !== MissionType.INITIAL_CLAIM){
              const weight = Number(campaignData.amount[0].amount) * (Number(el.weight));
              const mission = new Mission(
                el.id,
                el.name,
                el.description,
                convertMissionType(el.missionType),
                Number(el.weight) *100,
                weight.toString(),
                !!completed,
                !!claimed,
                el.claim_start_date
              );
              missionsList.push(mission);
            } else {
              initialMission = new Mission(
                el.id,
                el.name,
                el.description,
                convertMissionType(el.missionType),
                Number(el.weight) *100,
                '0',
                !!completed,
                !!claimed,
                el.claim_start_date
              );
            }
          });
          let totalWeight = 0;
          let totalWeightInPer = 0;
          missionsList.forEach((element) => {
            totalWeightInPer+= element.weightInPerc;
            totalWeight += Number(element.weight);
          });
          initialMission.weight = (Number(campaignData.amount[0].amount) - totalWeight).toString();
          initialMission.weightInPerc = (100 - totalWeightInPer);
          missionsList.unshift(initialMission);
          const status = checkCampaignStatus(new Date(campaign.start_time), new Date(campaign.end_time));
            camp = new Campaign(
              campaign.id,
              campaign.name,
              campaign.description,
              campaign.enabled,
              campaign.start_time,
              campaign.end_time,
              campaign.lockup_period,
              campaign.vesting_period,
              campaign.feegrant_amount,
              campaign.initial_claim_free_amount,
              missionsList,
              campaignData.amount[0].amount,
              campaign.campaign_total_amount[0].amount,
              status,
            );
        });
      return camp;
    },
  },

  getters: {
    getAirDropTotal(): AirdropTotal {
      return this.airDropMock;
    },
    getCampaigns(): Campaign[] {
      return this.campaigns;
    },
    getSummary(): ISummary {
      return this.summary;
    },
  },
});

function getPercentage(divider: Coin, divisor: Coin): BigDecimal {
  if (divisor.amount <= 0n) {
    return new BigDecimal(0);
  }
  return divideBigInts(divider.amount, divisor.amount);
}

