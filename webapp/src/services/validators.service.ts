import BaseService from "@/services/base.service";
import {Service} from "@/services/service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {DataHolder} from "@/models/data-holder";
import {ListDataService} from "@/services/list_data.service";
import {useValidatorsStore} from "@/store/validators.store";
import { Validators} from "@/models/validators";

const API_URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/validators';

export default class ValidatorsService extends BaseService<Validators> implements Service, ListDataService<Validators>{
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.VALIDATORS_SERVICE;
  }

  getListDataUrlByRole(): string {
    // const currentRole = useUserStore().getCurrentRole();
    // const providerId = useUserStore().getProviderId();
    // switch (currentRole) {
    //   case RoleEnum.SUPER_ADMIN:
    //     break;
    //   case RoleEnum.ADMINISTRATOR_FULL:
    //     break;
    //   case RoleEnum.ADMINISTRATOR_BASIC:
    //     break;
    //   case RoleEnum.TRADER:
    //     break;
    //   case RoleEnum.SUPER_AGENT:
    //     break;
    //   case RoleEnum.AGENT:
    //     break;
    //   case RoleEnum.PROSUMER:
    //     return API_URL;
    // }
    return API_URL;
  }

  setListDataToStore(dataHolder: Validators) :void{
    useValidatorsStore().setValidators(dataHolder);
  }

  getListDataHolder (): DataHolder {
    return useValidatorsStore().listDataHolder;
  }

  // getSingleDataUrlByRole(): string {
  //   // const providerId = useUserStore().getProviderId();
  //   return API_URL;
  // }

  // setSingleDataToStore(customer:Customer){
  //   useCustomerStore().setCustomer(customer);
  // }

}
