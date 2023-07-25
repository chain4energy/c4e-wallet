import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {AirdropErrData, BlockchainApiErrorData} from "@/models/blockchain/common";
import {CampaignsInfo} from "@/models/airdrop/airdrop";
import queries from "@/api/queries";
import {useConfigurationStore} from "@/store/configuration.store";
import {
  AirdropClaimsLeft,
  AirdropDistributions,
  CampaignBc,
  MissionsInfo,
  UserAirdropInfo
} from "@/models/blockchain/airdrop";
import {formatString} from "@/utils/string-formatter";

export class ClaimApi extends BaseApi {

  private AIRDROP_INFO_URL = queries.airdrop.AIRDROP_INFO;
  private USER_AIRDROP_ENTRIES_URL = queries.blockchain.USER_AIRDROP_ENTRIES_URL;
  private CAMPAIGNS_URL = queries.blockchain.CAMPAIGNS_URL;
  private CAMPAIGN_URL = queries.blockchain.CAMPAIGN_URL;
  private MISSIONS_URL = queries.blockchain.MISSIONS_URL;
  private CAMPAIGN_MISSIONS_URL = queries.blockchain.CAMPAIGN_MISSIONS_URL;
  private AIRDROP_DISTRIBUTIONS = queries.blockchain.AIRDROP_DISTRIBUTIONS;
  private AIRDROP_CLAIMS_LEFT = queries.blockchain.AIRDROP_CLAIMS_LEFT

  private useMockData = false;

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.AIR_DROP_API;
  }

  // public async fetchAirdropClaimRecord(address: string, lockscreen: boolean): Promise<RequestResponse<ClaimRecord, ErrorData<BlockchainApiErrorData>>> {
  //   return new RequestResponse<ClaimRecord, ErrorData<BlockchainApiErrorData>>(undefined, this.mockdata);
  // }

  public async fetchAirdropsInfo(lockscreen: boolean): Promise<RequestResponse<CampaignsInfo, ErrorData<AirdropErrData>>> {
    const mapData = (bcData: CampaignsInfo | undefined) => {
      if (bcData === undefined) {
        throw new Error('mapAirdropsInfo - airDrop absent');
      }
      return bcData;
    };
    return await this.axiosAirdropCall(useConfigurationStore().config.airdropBaseURL + this.AIRDROP_INFO_URL, mapData, lockscreen, null, 'fetchAirdropsInfo - ', false);
  }

  public async fetchAirdrop(address: string, airdropLocation: string, lockscreen: boolean): Promise<RequestResponse<any, ErrorData<AirdropErrData>>> {
    const mapData = (bcData: any | undefined) => {
      if (bcData === undefined) {
        throw new Error('mapAirdrop - airDrop absent');
      }
      return bcData;
    };
    const localUrl = useConfigurationStore().config.airdropBaseURL + airdropLocation + "/" + address + '.json';
    return await this.axiosAirdropCall(localUrl, mapData, lockscreen, null, 'fetchAirdrop - ', true);
  }

  public async fetchUserAirdropEntries(address: string, lockscreen: boolean): Promise<RequestResponse<UserAirdropInfo, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: UserAirdropInfo | undefined) => {
      if (bcData === undefined) {
        throw new Error('fetchUserAirdropEntries - data absent');
      }
      return bcData;
    };

    return await this.axiosGetBlockchainApiCall(formatString(this.USER_AIRDROP_ENTRIES_URL, {address: address}),
      mapData, lockscreen, null, 'fetchUserAirdropEntries - ');

  }

  // public async fetchCampaigns(lockscreen: boolean): Promise<RequestResponse<CampaignsInfoBc, ErrorData<BlockchainApiErrorData>>> {
  //   const mapData = (bcData: CampaignsInfoBc | undefined) => {
  //     if (bcData === undefined) {
  //       throw new Error('fetchCampaigns - data absent');
  //     }
  //     return bcData;
  //   };
  //     return await this.axiosGetBlockchainApiCall(this.CAMPAIGNS_URL,
  //       mapData, lockscreen, null, 'fetchCampaigns - ');
  // }
  public async fetchCampaign(id: string, lockscreen: boolean): Promise<RequestResponse<CampaignBc, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: CampaignBc | undefined) => {
      if (bcData === undefined) {
        throw new Error('fetchCampaigns - data absent');
      }
      return bcData;
    };
    return await this.axiosGetBlockchainApiCall(formatString(this.CAMPAIGN_URL,{campaign_id: id}),
      mapData, lockscreen, null, 'fetchCampaigns - ');
  }
  // public async fetchMissions(lockscreen: boolean): Promise<RequestResponse<MissionsInfo, ErrorData<BlockchainApiErrorData>>> {
  //   const mapData = (bcData: MissionsInfo | undefined) => {
  //     if (bcData === undefined) {
  //       throw new Error('fetchMissions - data absent');
  //     }
  //     return bcData;
  //   };
  //
  //   return await this.axiosGetBlockchainApiCall(this.MISSIONS_URL,
  //     mapData, lockscreen, null, 'fetchMissions - ');
  //
  // }

  public async fetchCampaignMissions(id: string, lockscreen: boolean): Promise<RequestResponse<MissionsInfo, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: MissionsInfo | undefined) => {
      if (bcData === undefined) {
        throw new Error('fetchMissions - data absent');
      }
      return bcData;
    };

    return await this.axiosGetBlockchainApiCall(formatString(this.CAMPAIGN_MISSIONS_URL, {campaign_id: id}),
      mapData, lockscreen, null, 'fetchMissions - ');

  }

  public async fetchAirdropDistributions(campaignId:string, lockscreen: boolean): Promise<RequestResponse<AirdropDistributions, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: AirdropDistributions | undefined) => {
      if (bcData === undefined) {
        throw new Error('fetchAirdropDistributions - data absent');
      }
      return bcData;
    };
    return await this.axiosGetBlockchainApiCall(formatString(this.AIRDROP_DISTRIBUTIONS, {campaign_id: campaignId}),
      mapData, lockscreen, null, 'fetchAirdropDistributions - ');
  }

  public async fetchAirdropClaimsLeft(campaignId:string, lockscreen: boolean): Promise<RequestResponse<AirdropClaimsLeft, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: AirdropClaimsLeft | undefined) => {
      if (bcData === undefined) {
        throw new Error('fetchAirdropClaimsLeft - data absent');
      }
      return bcData;
    };
    return await this.axiosGetBlockchainApiCall(formatString(this.AIRDROP_CLAIMS_LEFT, {campaign_id: campaignId}),
      mapData, lockscreen, null, 'fetchAirdropClaimsLeft - ');
  }

  // campainMockData: CampaignsInfoBc = {
  //   campaigns: [
  //     {
  //       id: "1",
  //       owner: "",
  //       name: "test1",
  //       description: "Campaign test1",
  //       enabled: true,
  //       start_time: "2023-01-20T10:48:58.952129766Z",
  //       end_time: "2023-02-31T12:50:58.952129766Z",
  //       lockup_period: "7884000s",
  //       vesting_period: "15768000s",
  //       feegrant_amount: "10",
  //       initial_claim_free_amount: "10"
  //       // denom: "uc4e"
  //     },
  //     {
  //       id: "2",
  //       owner: "",
  //       name: "test2",
  //       description: "Campaign test2",
  //       enabled: false,
  //       start_time: "2023-01-03T15:28:58.952129766Z",
  //       end_time: "2023-04-03T15:28:58.952129766Z",
  //       lockup_period: "7884000s",
  //       vesting_period: "15768000s",
  //       feegrant_amount: "10",
  //       initial_claim_free_amount: "10"
  //       // denom: "uc4e"
  //     },
  //     {
  //       id: "3",
  //       owner: "",
  //       name: "test3",
  //       description: "Campaign test3",
  //       enabled: false,
  //       start_time: "2023-01-01T15:28:58.952129766Z",
  //       end_time: "2023-01-02T15:28:58.952129766Z",
  //       lockup_period: "7884000s",
  //       vesting_period: "15768000s",
  //       feegrant_amount: "10",
  //       initial_claim_free_amount: "10"
  //       // denom: "uc4e"
  //     },
  //   ],
  //   pagination: {
  //     next_key: "1",
  //     total: "3",
  //   }
  // };

  // missionsMockData: MissionsInfo = {
  //   mission: [
  //     {
  //       id: "0",
  //       campaign_id: "1",
  //       name: "test",
  //       description: "description for first mission",
  //       missionType: MissionType.INITIAL_CLAIM,
  //       weight: 60000000
  //     },
  //     {
  //       id: "1",
  //       campaign_id: "1",
  //       name: "test",
  //       description: "description for second mission",
  //       missionType: MissionType.VOTE,
  //       weight: 60000000
  //     },
  //     {
  //       id: "2",
  //       campaign_id: "1",
  //       name: "test",
  //       description: "description for second mission",
  //       missionType: MissionType.DELEGATE,
  //       weight: 60000000
  //     },
  //     {
  //       id: "0",
  //       campaign_id: "2",
  //       name: "test",
  //       description: "description for first mission",
  //       missionType: MissionType.INITIAL_CLAIM,
  //       weight: 60000000
  //     },
  //     {
  //       id: "1",
  //       campaign_id: "2",
  //       name: "test",
  //       description: "description for first mission",
  //       missionType: MissionType.VOTE,
  //       weight: 60000000
  //     },
  //   ],
  //   pagination: {
  //     next_key: "1",
  //     total: "6",
  //   }
  // }
  //
  // UserAirdropEntriesMockData: UserAirdropInfo = {
  //   userAirdropEntries: {
  //     address: 'some',
  //     claim_address: '1230781203',
  //     airdrop_entries: [
  //       {
  //         campaign_id: "1",
  //         address: "some",
  //
  //         amount: 180000000,
  //         completedMissions: ['0','1'],
  //         claimedMissions: ['0']
  //       },
  //       {
  //         campaign_id: "2",
  //         address: "some",
  //         amount: 180000000,
  //         completedMissions: [],
  //         claimedMissions: []
  //       }
  //     ]
  //   }
  // }
  // mockdata: ClaimRecord =
  //   {
  //     address: "c4e1yyjfd5cj5nd0jrlvrhc5p3mnkcn8v9q8fdd9gs",
  //     claim_address: "",
  //     campaign_records: [
  //       {
  //         claimable: 11111,
  //         campaign: {
  //           campaign_id: "campain_id_1",
  //           description: "GLEAM",
  //           enabled: true,
  //           end_time: new Date("2023-01-20T11:45:20"),
  //           lockup_period: "7884000s",
  //           start_time: new Date("2023-01-01T15:28:58.952129766Z"),
  //           vesting_period: "15768000s"
  //         },
  //         missions: [
  //           {
  //             mission_id: "c_1_mission_1",
  //             description: "Mission ONE",
  //             weight: "1.000000000000000000",
  //             status: MissionStatus.INITIAL
  //           },
  //           {
  //             mission_id: "c_1_mission_2",
  //             description: "Mission TWO",
  //             weight: "0.200000000000000000",
  //             status: MissionStatus.COMPLETED
  //           },
  //           {
  //             mission_id: "c_1_mission_3",
  //             description: "Mission THREE",
  //             weight: "0.400000000000000000",
  //             status: MissionStatus.CLAIMED
  //           }
  //         ]
  //       },
  //       {
  //         claimable: 99999,
  //         campaign: {
  //           campaign_id: "campain_id_2",
  //           description: "AIRDROP",
  //           enabled: true,
  //           end_time: new Date("2023-02-01T18:21:58.952129766Z"),
  //           lockup_period: "7884000s",
  //           start_time: new Date("2023-01-19T09:54:00.952129766Z"),
  //           vesting_period: "15768000s"
  //         },
  //         missions: [
  //           {
  //             mission_id: "c_2_mission_1",
  //             description: "Mission ONE",
  //             weight: "2.000000000000000000",
  //             status: MissionStatus.INITIAL
  //           },
  //           {
  //             mission_id: "c_2_mission_2",
  //             description: "Mission TWO",
  //             weight: "1.200000000000000000",
  //             status: MissionStatus.COMPLETED
  //           },
  //           {
  //             mission_id: "c_2_mission_3",
  //             description: "Mission THREE",
  //             weight: "4.400000000000000000",
  //             status: MissionStatus.CLAIMED
  //           }
  //         ]
  //       },
  //     ]
  //   }
  // airDropMockData: Campaigns = {
  //   campaigns: [
  //     {
  //       name: "ATOM stakers campaign",
  //       details_url: "http://sdfdf.sdf/dsdfs/",
  //       alocations: [
  //         {
  //           name: "Base alloction",
  //           value: 107878179
  //         },
  //         {
  //           name: "Governance Booster allocation",
  //           value: 10000000
  //         },
  //         {
  //           name: "Decentralization Booster allocation",
  //           value: 10000000
  //         }
  //       ]
  //     },
  //     {
  //       name: "Greendrop compaign",
  //       details_url: "http://sdfdf.sdf/",
  //       alocations: [
  //         {
  //           name: "Token allocation",
  //           value: 21356534
  //         }
  //       ]
  //     },
  //     {
  //       name: "Santadrop compaign",
  //       details_url: "http://sdfdf.sdf/dsdfs/",
  //       alocations: [
  //         {
  //           name: "Token allocation",
  //           value: 21351232
  //         },
  //       ]
  //     }
  //
  //   ]
  // }
}
