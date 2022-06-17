import {defineStore} from "pinia";
import {DataHolder} from "@/models/data-holder";
import {Validator} from "@/models/validator";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import apiFactory from "@/api/factory.api";

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: () => {
    return {
      validators: Object(DataHolder),
      validator: new Validator,
      numberOfActiveValidators: Object(Number),
    };
  },
  actions: {
    fetchValidators(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null) {
      apiFactory.validatorsApi().fetchAllValidators(pagination, lockScreen, localSpinner)
        .then((response) => {
            if (response.error == null && response.data != undefined) {
              // create DataHolder object from received data
              const dataHolder = new DataHolder<Validator>();
              for (const element of response.data.validators) {
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
