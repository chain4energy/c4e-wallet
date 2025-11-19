import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { RequestResponse } from "@/models/request-response";
import BaseApi, { ErrorData } from "@/api/base.api";
import { HasuraErrorData } from "@/models/hasura/error";
import queries from "./queries";

interface Transaction {
  messages: unknown;
  success: boolean;
  block?: {
    timestamp: string;
    height: string;
  };
}

interface AmountInfo {
  denom: string;
  amount: string;
}

interface ValueObject {
  amount: AmountInfo[];
  depositor: string;
}

export interface CommunityPoolMessage {
  transaction_hash: string;
  value: ValueObject;
  transaction: Transaction;
}

export interface CommunityPoolData {
  message: CommunityPoolMessage[];
}

interface CommunityPoolHasuraResponse {
  data: {
    message: CommunityPoolMessage[];
  };
}

export class CommunityPoolApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.COMMUNITY_POOL_API;
  }

  public async fetchCommunityPoolData(
    lockScreen: boolean
  ): Promise<RequestResponse<CommunityPoolData, ErrorData<HasuraErrorData>>> {
    const mapData = (hasuraData: CommunityPoolHasuraResponse | undefined) => {
      if (!hasuraData?.data?.message) {
        return { message: [] } as CommunityPoolData;
      }
      return { message: hasuraData.data.message } as CommunityPoolData;
    };

    return this.axiosHasuraCall(
      queries.hasura.COMMUNITY_POOL_FUND_QUERY,
      mapData,
      lockScreen,
      null,
      'fetchCommunityPoolData - '
    );
  }
}
