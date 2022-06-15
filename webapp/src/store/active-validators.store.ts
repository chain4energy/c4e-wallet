import {defineStore} from "pinia";
import apiFactory from "@/services/ApiFactory";

export const useActiveValidatorsStore = defineStore({

  id: 'activeValidatorsStore',
  state: () => {
    return {
      numberOfActiveValidators: Object(Number),
    };
  },
  actions: {
    fetchNumberOfActiveValidators(){
      apiFactory.activeValidatorsApi().fetchActiveValidatorCount().then((response)=>{
        if( response.error == null ) {
          this.numberOfActiveValidators = response.data?.data.activeTotal.aggregate.count;
        } else {
          //TODO: error handling
        }
      });
    }
  },
  getters: {
    getActiveValidators(): number {
      return this.numberOfActiveValidators;
    },
  }
});
