import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {BlockchainApiErrorData, AirdropErrData} from "@/models/blockchain/common";
import {Campaigns, CampaignsInfo, ClaimRecord, MissionStatus} from "@/models/airdrop/airdrop";
import queries from "@/api/queries";
import {useConfigurationStore} from "@/store/configuration.store";
import {Validator} from "@/models/store/validator";
import {ValidatorsResponse} from "@/models/blockchain/validator";
import {mapAndAddValidators, mapValidators, sortAndRankValidators} from "@/models/mapper/validator.mapper";
import {UserAirdropInfo} from "@/models/blockchain/airdrop";

export class AirDropApi extends BaseApi {

  private AIRDROP_INFO_URL = queries.airdrop.AIRDROP_INFO;
  private USER_AIRDROP_ENTRIES_URL = queries.blockchain.USER_AIRDROP_ENTRIES_URL;
  private CAMPAIGNS_URL = queries.blockchain.CAMPAIGNS_URL;
  private MISSIONS_URL = queries.blockchain.MISSIONS_URL;


  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.AIR_DROP_API;
  }

  public async fetchAirdropMockData(address: string, lockscreen: boolean): Promise<RequestResponse<Campaigns, ErrorData<BlockchainApiErrorData>>> {
    return new RequestResponse<Campaigns, ErrorData<BlockchainApiErrorData>>(undefined, this.airDropMockData);
  }

  public async fetchAirdropClaimRecord(address: string, lockscreen: boolean): Promise<RequestResponse<ClaimRecord, ErrorData<BlockchainApiErrorData>>> {
    return new RequestResponse<ClaimRecord, ErrorData<BlockchainApiErrorData>>(undefined, this.mockdata);
  }

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

  public async fetchUserAirdropEntries(lockscreen: boolean): Promise<RequestResponse<UserAirdropInfo, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: UserAirdropInfo | undefined) => {
      if (bcData === undefined) {
        throw new Error('mapAirdropsInfo - airDrop absent');
      }
      return bcData;
    };

    return await this.axiosGetBlockchainApiCall(this.USER_AIRDROP_ENTRIES_URL,
      mapData, lockscreen, null, 'fetchUserAirdropEntries - ');

  }


  mockdata: ClaimRecord =
    {
      address: "c4e1yyjfd5cj5nd0jrlvrhc5p3mnkcn8v9q8fdd9gs",
      claim_address: "",
      campaign_records: [
        {
          claimable: 11111,
          campaign: {
            campaign_id: "campain_id_1",
            description: "GLEAM",
            enabled: true,
            end_time: new Date("2022-12-19T15:25:58.952129766Z"),
            lockup_period: "7884000s",
            start_time: new Date("2022-11-11T15:28:58.952129766Z"),
            vesting_period: "15768000s"
          },
          missions: [
            {
              mission_id: "c_1_mission_1",
              description: "Mission ONE",
              weight: "1.000000000000000000",
              status: MissionStatus.INITIAL
            },
            {
              mission_id: "c_1_mission_2",
              description: "Mission TWO",
              weight: "0.200000000000000000",
              status: MissionStatus.COMPLETED
            },
            {
              mission_id: "c_1_mission_3",
              description: "Mission THREE",
              weight: "0.400000000000000000",
              status: MissionStatus.CLAIMED
            }
          ]
        },
        {
          claimable: 99999,
          campaign: {
            campaign_id: "campain_id_2",
            description: "AIRDROP",
            enabled: true,
            end_time: new Date("2022-12-12T18:21:58.952129766Z"),
            lockup_period: "7884000s",
            start_time: new Date("2022-12-11T18:21:58.952129766Z"),
            vesting_period: "15768000s"
          },
          missions: [
            {
              mission_id: "c_2_mission_1",
              description: "Mission ONE",
              weight: "2.000000000000000000",
              status: MissionStatus.INITIAL
            },
            {
              mission_id: "c_2_mission_2",
              description: "Mission TWO",
              weight: "1.200000000000000000",
              status: MissionStatus.COMPLETED
            },
            {
              mission_id: "c_2_mission_3",
              description: "Mission THREE",
              weight: "4.400000000000000000",
              status: MissionStatus.CLAIMED
            }
          ]
        },
      ]
    }
  airDropMockData: Campaigns = {
    campaigns: [
      {
        name: "ATOM stakers campaign",
        details_url: "http://sdfdf.sdf/dsdfs/",
        alocations: [
          {
            name: "Base alloction",
            value: 107878179
          },
          {
            name: "Governance Booster allocation",
            value: 10000000
          },
          {
            name: "Decentralization Booster allocation",
            value: 10000000
          }
        ]
      },
      {
        name: "Greendrop compaign",
        details_url: "http://sdfdf.sdf/",
        alocations: [
          {
            name: "Token allocation",
            value: 21356534
          }
        ]
      },
      {
        name: "Santadrop compaign",
        details_url: "http://sdfdf.sdf/dsdfs/",
        alocations: [
          {
            name: "Token allocation",
            value: 21351232
          },
        ]
      }

    ]
  }
}
