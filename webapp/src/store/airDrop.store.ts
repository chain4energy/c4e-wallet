import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {AirdropTotal, AlocationsSt, Campaign, CampaignAllocation, convertMissionType, findCampaign, findMission, Mission} from "@/models/store/airdrop";
import {ClaimRecord} from "@/models/airdrop/airdrop";
import {RequestResponse} from "@/models/request-response";
import {ErrorData} from "@/api/base.api";
import {AirdropErrData} from "@/models/blockchain/common";
import {LogLevel} from "@/services/logger/log-level";
import {CampaignsInfo, MissionsInfo, UserAirdropInfo} from "@/models/blockchain/airdrop";
import {StoreLogger} from "@/services/logged.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {Coin} from "@/models/store/common";

const logger = new StoreLogger(ServiceTypeEnum.AIR_DROP_STORE);

interface airDropState {
  // airDrop1: AirdropStore
  // no_Drop: boolean,

  claimRecord: ClaimRecord,
  airDropMock: AirdropTotal,
  campaigns: Campaign[];

}

export const useAirDropStore = defineStore({
  id: 'airDropStore',
  state: (): airDropState => {
    return {
      // airDrop1: Object(AirdropStore),
      // no_Drop: Boolean(false),
      claimRecord: {} as ClaimRecord,
      airDropMock: Object(AirdropTotal),
      campaigns: Array<Campaign>()
    };
  },
  actions: {
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
    async fetchAirdropClaimRecord(address: string, lockscreen = true) {
      try {
        apiFactory.airDropApi().fetchAirdropClaimRecord(address, lockscreen).then((resp) => {
          if (resp.data) {
            this.claimRecord = resp.data;
          }
        });
      } catch (err) {
        //console.error(err);
      }
    },
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
    async fetchAirdropTotal(address: string, lockscreen = true) {
      try {

        const response = await apiFactory.airDropApi().fetchAirdropsInfo(lockscreen);
        console.log(JSON.stringify(response));
        const promises = Array<Promise<RequestResponse<any, ErrorData<AirdropErrData>>>>();
        const campaignsList = Array<CampaignAllocation>();
        if (response.isSuccess() && response.data?.campaignInfoDetails) {
          const campaignInfoDetails = response.data.campaignInfoDetails;
          //create array with requests for particular airdrop
          campaignInfoDetails.forEach((campaign) => {
            promises.push(apiFactory.airDropApi().fetchAirdrop(address, campaign.subfolder, lockscreen));
          });
          //wait for all requests
          const responseList = await Promise.all(promises);
          for (let i = 0; i < campaignInfoDetails.length; i++) {
            const campaign = campaignInfoDetails[i];
            const allocations = new Array<AlocationsSt>();
            campaign.allocationMapping.forEach((allocation) => {
              let mappedValue = 0;
              if (responseList[i].isSuccess()) {
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
    async fetchCampaigns(address: string, lockscreen = true) {
      let userAirdropInfo = {} as UserAirdropInfo;
      let campaignsInfo = {} as CampaignsInfo;
      let missions = {} as MissionsInfo;
      const result = Array<Campaign>();
      await Promise.all([
        await apiFactory.airDropApi().fetchCampaigns(lockscreen).then(response => {
          if (response.isSuccess() && response.data !== undefined) {
            campaignsInfo = response.data;
          } else {
            const message = 'Error fetching campaigns data';
            logger.logToConsole(LogLevel.ERROR, message);
            // toast.error(message);
          }
        }),
        await apiFactory.airDropApi().fetchMissions(lockscreen).then(response => {
          if (response.isSuccess() && response.data !== undefined) {
            missions = response.data;
          } else {
            const message = 'Error fetching missions data';
            logger.logToConsole(LogLevel.ERROR, message);
            // toast.error(message);
          }
        }),
        await apiFactory.airDropApi().fetchUserAirdropEntries(address, lockscreen).then(response => {
          if (response.isSuccess() && response.data !== undefined) {
            userAirdropInfo = response.data;
          } else {
            const message = 'Error fetching user airdrop entries data';
            logger.logToConsole(LogLevel.ERROR, message);
            // toast.error(message);
          }
        })
      ]);

      campaignsInfo?.campaign.forEach(entry => {
        const campaign = new Campaign(entry.id, entry.name, entry.description, entry.enabled, entry.start_time, entry.end_time, entry.lockup_period,
          entry.vesting_period, new Coin(BigInt(0), ''), new Array<Mission>()
        );
        result.push(campaign);
      });

      missions?.mission.forEach(entry => {
        const campaign = findCampaign(result, entry.campaign_id);
        if (campaign) {
          campaign.missions.push(new Mission(entry.id, entry.name, entry.description, convertMissionType(entry.missionType), entry.weight, false, false, undefined));
        } else {
          logger.logToConsole(LogLevel.ERROR, "Campaign not found id:" + entry.campaign_id);
        }
      });

      userAirdropInfo?.userAirdropEntries.airdrop_entries.forEach(entry => {
        const campaign = findCampaign(result, entry.campaignId);
        if (campaign) {
          campaign.amount = new Coin(BigInt(entry.amount.amount), entry.amount.denom);
          entry.claimedMissions.forEach(missionId => {
            const claimedMission =  findMission(campaign.missions, missionId);
            if (claimedMission) {
              claimedMission.claimed = true;
            } else {
              logger.logToConsole(LogLevel.ERROR, "claimedMission not found id:" + missionId);
            }
          });
          entry.completedMissions.forEach(missionId => {
            const completedMission =  findMission(campaign.missions, missionId) ;
            if (completedMission) {
              completedMission.completed = true;
            } else {
              logger.logToConsole(LogLevel.ERROR, "completedMission not found id:" + missionId);
            }
          });
        } else {
          logger.logToConsole(LogLevel.ERROR, "Campaign not found id:" + entry.campaignId);
        }

      });

      this.campaigns = result;
    }
  },
  getters: {
    // getAirDropStatus(): boolean {
    //   return this.no_Drop;
    // },
    // getAirDrop(): AirdropStore {
    //   return this.airDrop1;
    // },
    getAirdropClaimRecord(): ClaimRecord {
      return this.claimRecord;
    },
    getAirDropTotal(): AirdropTotal {
      return this.airDropMock;
    },
    getCampaigns(): Campaign[]{
      return this.campaigns;
    }
  },
});
