import {defineStore} from "pinia";
import {DataHolder} from "@/models/data-holder";
import {Validator} from "@/models/validator";
import {Validators} from "@/models/validators";

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: () => {
    return {
      validators:  Object(DataHolder),
      validator: new Validator
    };
  },
  actions: {
    setValidators (validators:  Validators) {
      const dataHolder = new DataHolder;
      for(const element of validators.validators){
        dataHolder.elements.push(element);
      }
      dataHolder.amount = Number(validators.pagination.total);
      this.validators = dataHolder;
    },
    setValidator(validator : Validator){
      this.validator = validator;
    }
  },
  getters: {
    listDataHolder ():DataHolder {
      return this.validators;
    },
    singleData ():Validator{
      return this.validator;
    }
  }
});
