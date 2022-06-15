import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {ActiveValidatorCount} from "@/models/ActiveValidatorCount";

 export class ActiveValidatorsApi extends BaseService<any> {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.ACTIVE_VALIDATORS_SERVICE;
  }

  //TODO: MS: move to global configuration service
  URL =  'https://hasura-testnet.chain4energy.org/v1/graphql';

   public async fetchActiveValidatorCount() :Promise<RequestResponse<ActiveValidatorCount>>{
    return this.axiosCall({
       method: 'POST',
       url: this.URL,
       data: {
         query: "query ActiveValidatorCount {\n" +
           "  activeTotal: validator_status_aggregate(where: {status: {_eq: 3}}) {\n" +
           "    aggregate {\n" +
           "      count\n" +
           "    }\n" +
           "  }\n" +
           "}",
       }
     }, true, null);
   }

  // setActiveValidators(data: any) :void{
  //   console.log(data);
  //   useActiveValidatorsStore().setNumberOfActiveValidators(data.data.activeTotal.aggregate.count);
  // }

}
