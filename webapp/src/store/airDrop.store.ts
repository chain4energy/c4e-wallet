import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {
  AirdropTotal,
  AlocationsSt,
  Campaign,
  CampaignAllocation,
  convertMissionType,
  // FairdropPollUsage,
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
import {useUserStore} from "@/store/user.store";
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
    // async fetchAirdrop(address: string, lockscreen = true) {
    //   this.no_Drop = Boolean(false);
    //   try {
    //     apiFactory.airDropApi().fetchAirdropCosmos(address, lockscreen).then((res) => {
    //       if (res?.data) {
    //         this.airDrop1 = new AirdropStore(
    //           res.data.atom_staked_balance,
    //           res.data.atom_address,
    //           res.data.c4e_address,
    //           res.data.base_airdrop,
    //           res.data.booster_1_airdrop,
    //           res.data.booster_2_airdrop,
    //           res.data.gleam_airdrop,
    //           new DecCoin(new BigDecimal(BigInt(res.data.total_amount)), 'uc4e'),
    //           res.data.voted_on_proposal,
    //           res.data.atom_delegated_outside,
    //           res.data.delegated_outside,
    //         );
    //         this.no_Drop = true;
    //       }
    //     });
    //   } catch (err) {
    //     this.no_Drop = false;
    //   }
    // },
    // async fetchAirdropClaimRecord(address: string, lockscreen = true) {
    //   try {
    //     apiFactory.airDropApi().fetchAirdropClaimRecord(address, lockscreen).then((resp) => {
    //       if (resp.data) {
    //         this.claimRecord = resp.data;
    //       }
    //     });
    //   } catch (err) {
    //     //console.error(err);
    //   }
    // },
    // async fetchTestAirDropClaiming() {
    //   try {
    //     apiFactory.airDropApi().fetchUserAirdropEntries('', true).then((res) => {
    //       console.log(res);
    //     });
    //   } catch (err) {
    //     //console.error(err);
    //   }
    // },
    // async fetchAirdropTotalOld(address: string, lockscreen = true) {
    //   try {
    //     apiFactory.airDropApi().fetchAirdropMockData(address, lockscreen).then((resp) => {
    //       if (resp.data) {
    //         this.airDropMock = Object(AirdropTotal);
    //         const campainsList = Array<Campain>();
    //         resp.data.campaigns.forEach((element) => {
    //           const campains = Array<AlocationsSt>();
    //           element.alocations.forEach((el) => {
    //             campains.push(new AlocationsSt(el.name, el.value));
    //           });
    //           campainsList.push(new Campain(element.name, element.details_url, campains));
    //         });
    //         this.airDropMock = new AirdropTotal(campainsList);
    //       }
    //       else {
    //         this.airDropMock = Object(AirdropTotal);
    //       }
    //     });
    //   } catch (err) {
    //     //console.error(err);
    //   }
    // },
    async claimInitialAirdrop(campaignId: string, extraAddress: string) {
      const connectionInfo = useUserStore().connectionInfo;
      if (!extraAddress || extraAddress === '') {
        return await apiFactory.accountApi().claimInitialAirDrop(connectionInfo, campaignId, useUserStore().account.address);
      } else {
        return await apiFactory.accountApi().claimInitialAirDrop(connectionInfo, campaignId, extraAddress);
      }
    },
    async claimOtherAirdrop(campaignId: string, missionId: string) {
      const connectionInfo = useUserStore().connectionInfo;
      return await apiFactory.accountApi().claimAirDropMissions(connectionInfo, campaignId, missionId);
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
    // async fetchCampaigns(address: string, lockscreen = true) {
    //   logger.logToConsole(LogLevel.INFO, "fetchCampaigns:", address);
    //   let userAirdropInfoLcd = {} as UserAirdropInfo;
    //   let campaignsInfoLcd = {} as CampaignsInfo;
    //   let missionsLcd = {} as MissionsInfo;
    //   const result = Array<Campaign>();
    //   await Promise.all([
    //     apiFactory.airDropApi().fetchCampaigns(lockscreen).then(response => {
    //       if (response.isSuccess() && response.data !== undefined) {
    //         campaignsInfoLcd = response.data;
    //         console.log('------------------------------------------------------', campaignsInfoLcd);
    //         this.fetchFairdropPoolUsage(campaignsInfoLcd.campaign.map((c: CampaignBc) => c.id), lockscreen);
    //       } else {
    //         const message = 'Error fetching campaigns data';
    //         logger.logToConsole(LogLevel.ERROR, message);
    //         // toast.error(message);
    //       }
    //     }),
    //     apiFactory.airDropApi().fetchMissions(lockscreen).then(response => {
    //       if (response.isSuccess() && response.data !== undefined) {
    //         missionsLcd = response.data;
    //       } else {
    //         const message = 'Error fetching missions data';
    //         logger.logToConsole(LogLevel.ERROR, message);
    //         // toast.error(message);
    //       }
    //     }),
    //     apiFactory.airDropApi().fetchUserAirdropEntries(address, lockscreen).then(response => {
    //       if (response.isSuccess() && response.data !== undefined) {
    //         userAirdropInfoLcd = response.data;
    //       } else {
    //         const message = 'Error fetching user airdrop entries data';
    //         logger.logToConsole(LogLevel.ERROR, message);
    //         // toast.error(message);
    //       }
    //     })
    //   ]);
    //   campaignsInfoLcd?.campaign.forEach((entry: CampaignBc) => {
    //     const campaign = new Campaign(Number(entry.id), entry.name, entry.description, entry.enabled, entry.start_time, entry.end_time, entry.lockup_period,
    //       entry.vesting_period, entry.feegrant_amount, entry.initial_claim_free_amount
    //     );
    //     result.push(campaign);
    //   });
    //
    //   missionsLcd?.mission.forEach((entry: MissionBc) => {
    //     const campaign = findCampaign(result, Number(entry.campaign_id));
    //     if (campaign) {
    //       campaign.missions.push(new Mission(entry.id, entry.name, entry.description, convertMissionType(entry.missionType), entry.weight, false, false, undefined));
    //     } else {
    //       logger.logToConsole(LogLevel.ERROR, "missions -> Campaign not found id:" + entry.campaign_id);
    //     }
    //   });
    //
    //   userAirdropInfoLcd?.userAirdropEntries.airdrop_entries.forEach((entry: AirdropEntry) => {
    //     const campaign = findCampaign(result, Number(entry.campaign_id));
    //     if (campaign) {
    //       console.log(campaign);
    //       console.log("entry:", entry);
    //       // const totalAmount = new Coin(BigInt(0), "uc4e");
    //       // totalAmount.add(getDenomFromArray(entry.airdrop_coins, useConfigurationStore().config.airdropDefaultDenom));
    //       // campaign.amount = totalAmount;
    //       campaign.amount = getDenomFromArray(entry.airdrop_coins, useConfigurationStore().config.airdropDefaultDenom);
    //       entry.claimedMissions.forEach((missionId: string) => {
    //         const claimedMission = findMission(campaign.missions, missionId);
    //         if (claimedMission) {
    //           claimedMission.claimed = true;
    //         } else {
    //           logger.logToConsole(LogLevel.ERROR, "claimedMission not found id:" + missionId);
    //         }
    //       });
    //       entry.completedMissions.forEach((missionId: string) => {
    //         const completedMission = findMission(campaign.missions, missionId);
    //         if (completedMission) {
    //           completedMission.completed = true;
    //         } else {
    //           logger.logToConsole(LogLevel.ERROR, "completedMission not found id:" + missionId);
    //         }
    //       });
    //     } else {
    //       logger.logToConsole(LogLevel.ERROR, "userAirdropEntries -> Campaign not found id:" + entry.campaign_id);
    //     }
    //
    //   });
    //
    //   logger.logToConsole(LogLevel.DEBUG, JSON.stringify(result, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
    //   this.campaigns = result;
    // },
    /*
    async fetchAirdropPoolUsage(campaingIds: string[], lockscreen = true) {

      const distributions = new Coin(BigInt(0), "uc4e");
      const claimsLeft = new Coin(BigInt(0), "uc4e");
      const promises = Array<Promise<void>>();

      campaingIds.forEach((id: string) => {
        promises.push(apiFactory.airDropApi().fetchAirdropDistributions(id, lockscreen).then(response => {
          if (response.isSuccess() && response.data !== undefined) {
            distributions.add(getDenomFromArray(response.data.airdrop_coins, useConfigurationStore().config.airdropDefaultDenom));
          } else {
            const message = 'Error fetchAirdropDistributions';
            logger.logToConsole(LogLevel.ERROR, message);
            // toast.error(message);
          }
        }));
        promises.push(apiFactory.airDropApi().fetchAirdropClaimsLeft(id, lockscreen).then(response => {
          if (response.isSuccess() && response.data !== undefined) {
            claimsLeft.add(getDenomFromArray(response.data.airdrop_coins, useConfigurationStore().config.airdropDefaultDenom));
          } else {
            const message = 'Error fetchAirdropClaimsLeft';
            logger.logToConsole(LogLevel.ERROR, message);
            // toast.error(message);
          }
        }));
      });
      await Promise.all(promises);
      this.fairdropPollUsage = new FairdropPollUsage(new Coin(BigInt(20000000), "C4E"),
        new Coin(distributions.amount - claimsLeft.amount, distributions.denom),
        distributions,
        claimsLeft,
        getPercentage(this.fairdropPollUsage.total.amount, this.fairdropPollUsage.claimed.amount),
        getPercentage(distributions.amount, claimsLeft.amount));
    },

     */

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
    // async fetchCampaigns(address: string, lockscreen = true){
    //   //await this.getUsersCampaignData(address);
    //     // let userAirdropInfoLcd = {} as UserAirdropInfo;
    //     let campaignsInfoLcd = {} as CampaignsInfo;
    //     // let missionsLcd = {} as MissionsInfo;
    //   const campaignList = Array<Campaign>()
    //   await apiFactory.airDropApi().fetchCampaigns(lockscreen).then(async response => {
    //     if (response.isSuccess() && response.data) {
    //       campaignsInfoLcd = response.data;
    //       for (const el of campaignsInfoLcd.campaigns) {
    //         await this.fetchMissions(el.id)
    //         const campaign = new Campaign(
    //           Number(el.id),
    //           el.name,
    //           el.description,
    //           el.enabled,
    //           el.start_time,
    //           el.end_time,
    //           el.lockup_period,
    //           el.vesting_period,
    //           el.feegrant_amount,
    //           el.initial_claim_free_amount
    //         );
    //         campaignList.push(campaign)
    //       }
    //     }
    //   });
    //   // this.campaigns = campaignList;
    // },

  },

  getters: {
    // getAirdropClaimRecord(): UserAirdropEntry {
    //   return this.claimRecord;
    // },
    getAirDropTotal(): AirdropTotal {
      return this.airDropMock;
    },
    getCampaigns(): Campaign[] {
      return this.campaigns;
    },
    // getFairdropPoolUsage(): FairdropPollUsage {
    //   return this.fairdropPollUsage;
    // },
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

