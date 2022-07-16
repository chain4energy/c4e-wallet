import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { useUserStore } from "@/store/user.store";
import { Validator, ValidatorStatus } from "@/models/store/validator";

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
    async fetchValidators(){
      await apiFactory.validatorsApi().fetchAllValidators()
        .then((resp) => {
          if (resp.isSuccess() && resp.data !== undefined){
            this.validators = resp.data.validators;
            this.numberOfActiveValidators = resp.data.numberOfActive
          } else {
            // TODO
          }
      });

    },

    fetchNumberOfActiveValidators(){ // TODO probably remove this func and fetchActiveValidatorCount from validatorsApi
      apiFactory.validatorsApi().fetchActiveValidatorCount().then((response)=>{
        if( response.error == null ) {
          if (response.data == undefined) {
            this.numberOfActiveValidators = 0 // TODO maybe some error ???
          } else {
            this.numberOfActiveValidators = response.data.data.activeTotal.aggregate.count;
          }
        } else {
          //TODO: error handling
        }
      });
    },
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
