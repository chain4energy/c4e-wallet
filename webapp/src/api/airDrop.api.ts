import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {BlockchainApiErrorData} from "@/models/blockchain/common";
import {airDrop, Campaigns, ClaimRecord, MissionStatus} from "@/models/airdrop/airdrop";
import {mapAirDrop} from "@/models/mapper/airDrop.mapper";

export class AirDropApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.AIR_DROP_API;
  }

  public async fetchAirdropCosmos(address: string, lockscreen: boolean): Promise<RequestResponse<airDrop, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: airDrop | undefined) => {
      return mapAirDrop(bcData);
    };
    return await this.axiosAirDropCall(address,
      mapData, lockscreen, null, 'fetchTotalSupply - ', undefined, undefined, true);
  }

  public async fetchAirdropMockData(address: string, lockscreen: boolean): Promise<RequestResponse<Campaigns, ErrorData<BlockchainApiErrorData>>> {
    return new RequestResponse<Campaigns, ErrorData<BlockchainApiErrorData>>(undefined, this.airDropMockData);
  }

  public async fetchAirdropClaimRecord(address: string, lockscreen: boolean): Promise<RequestResponse<ClaimRecord, ErrorData<BlockchainApiErrorData>>> {
    return new RequestResponse<ClaimRecord, ErrorData<BlockchainApiErrorData>>(undefined, this.mockdata);
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
            end_time: new Date("2022-12-17T18:21:58.952129766Z"),
            lockup_period: "7884000s",
            start_time: new Date("2022-11-17T18:21:58.952129766Z"),
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
            end_time: new Date("2022-12-17T18:21:58.952129766Z"),
            lockup_period: "7884000s",
            start_time: new Date("2022-11-17T18:21:58.952129766Z"),
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
        details_url: "http://sdfdf.sdf/dsdfs/",
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
