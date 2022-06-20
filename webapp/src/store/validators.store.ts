import {defineStore} from "pinia";
import {DataHolder} from "@/models/data-holder";
import {Validator} from "@/models/validator";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import apiFactory from "@/api/factory.api";
import {useTokensStore} from "@/store/tokens.store";

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: () => {
    return {
      validators: Object(DataHolder),
      validator: Object,
      numberOfActiveValidators: Object(Number),
    };
  },
  actions: {
    async fetchValidators(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null) {
      await useTokensStore().fetchTotalSupply();
      apiFactory.validatorsApi().fetchAllValidators(pagination, lockScreen, localSpinner)
        .then(async (response) => {
            if (response.error == null && response.data != undefined) {
              const total = await useTokensStore().getTotalSupply;
              // create DataHolder object from received data
              const dataHolder = new DataHolder<Validator>();
              for (const element of response.data.validators) {
                element.vp = element.tokens / Math.floor(total.amount) * 100;
                dataHolder.elements.push(element);
              }
              dataHolder.amount = Number(response.data.pagination.total);
              this.validators = dataHolder;
            } else {
              //TODO: error handling
            }
          }
        );
    },
    fetchNumberOfActiveValidators(){
      apiFactory.validatorsApi().fetchActiveValidatorCount().then((response)=>{
        if( response.error == null ) {
          this.numberOfActiveValidators = response.data?.data.activeTotal.aggregate.count;
        } else {
          //TODO: error handling
        }
      });
    }
  },
  getters: {
    getValidators(): DataHolder<Validator> {
     return this.validators;
    },
    getActiveValidators(): number {
      return this.numberOfActiveValidators;
    },
  }
});
