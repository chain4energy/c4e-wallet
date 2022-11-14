import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { useUserStore } from "@/store/user.store";
import { Validator, ValidatorStatus } from "@/models/store/validator";
import { useToast } from "vue-toastification";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";
import { Params } from "@/models/store/params";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.USER_STORE);

interface ValidatorsState {
  validators: Validator[]
  numberOfActiveValidators: number
  params : Params
}

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: (): ValidatorsState => {
    return {
      validators: Array<Validator>(),
      numberOfActiveValidators: 0,
      params : Object() as Params
    };
  },
  actions: {
    async fetchValidators(lockscreen = true){
      await apiFactory.validatorsApi().fetchAllValidators(lockscreen)
        .then((resp) => {
          if (resp.isSuccess() && resp.data !== undefined){
            this.validators = resp.data.validators;
            this.numberOfActiveValidators = resp.data.numberOfActive;
            this.validators.forEach((v) => {
              if (v.description.identity) {
                fetchPicture(v);
              }
            });
          } else {
            const message = 'Error fetching validators data';
            logger.logToConsole(LogLevel.ERROR, message);
            toast.error(message);
          }
      });

    },
    async fetchStackingParams(lockscreen = true) {
      await apiFactory.validatorsApi().fetchStakingParams(lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined){
          console.log(resp);
          this.params = resp.data;
        }
      });
    },

    clear() {
      this.validators = Array<Validator>();
      this.numberOfActiveValidators = 0;
    }

  },
  getters: {
    getValidators(): Validator[]{
     return this.validators;
    },
    getActiveValidators(): Validator[]{
      return this.validators.filter((el) => el.status === ValidatorStatus.Bonded);
    },
    getInactiveValidators(): Validator[]{
      return this.validators.filter((el) => el.status !== ValidatorStatus.Bonded);
    },
    getUserValidators(): Validator[]{
      const delegations = useUserStore().delegations;
      const undelegations = useUserStore().undelegations;
      const rewards = useUserStore().rewards;
      return this.validators.filter(
        (el) => delegations.delegations.has(el.operatorAddress)
                  || undelegations.undelegations.has(el.operatorAddress)
                  || rewards.rewards.has(el.operatorAddress)
        );
    },
    getUserDelgationsValidators(): Validator[]{
      const delegations = useUserStore().delegations;
      const rewards = useUserStore().rewards;
      return this.validators.filter(
        (el) => delegations.delegations.has(el.operatorAddress)
                  || rewards.rewards.has(el.operatorAddress)
        );
    },
    getUserUndelgationsValidators(): Validator[]{
      const undelegations = useUserStore().undelegations;
      return this.validators.filter(
        (el) => undelegations.undelegations.has(el.operatorAddress)
        );
    },
    getNumberOfAllValidators(): number {
      return this.validators.length;
    },
    getNumberOfActiveValidators(): number {
      return this.numberOfActiveValidators;
    },
    getNumberOfInactiveValidators(): number {
      return this.validators.length - this.numberOfActiveValidators;
    },
    getParamsUnbondingTime(): number{
      return this.params.unbondingTime;
    }
  }
});

async function fetchPicture(validator: Validator) {
  const resp = await apiFactory.keybaseApi().fetchPictureAddress(validator.description.identity, false);
  if (resp.isSuccess() && resp.data !== undefined){
    validator.description.pictureUrl = resp.data;
  }
}
