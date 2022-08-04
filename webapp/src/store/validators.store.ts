import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { useUserStore } from "@/store/user.store";
import { Validator, ValidatorStatus } from "@/models/store/validator";
import { useToast } from "vue-toastification";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.USER_STORE);

interface ValidatorsState {
  validators: Validator[]
  numberOfActiveValidators: number
}

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: (): ValidatorsState => {
    return {
      validators: Array<Validator>(),
      numberOfActiveValidators: 0,
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
            })
          } else {
            const message = 'Error fetching validators data';
            logger.logToConsole(LogLevel.ERROR, message);
            toast.error(message);
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
    getValidatorsWithDelegations(): Validator[]{
      const delegations = useUserStore().delegations;
      return this.validators.filter((el) => delegations.delegations.has(el.operatorAddress));
    },
    getNumberOfActiveValidators(): number {
      return this.numberOfActiveValidators;
    },
  }
});

async function fetchPicture(validator: Validator) {
  const resp = await apiFactory.keybaseApi().fetchPictureAddress(validator.description.identity, false);
  if (resp.isSuccess() && resp.data !== undefined){
    validator.description.pictureUrl = resp.data
  }
}