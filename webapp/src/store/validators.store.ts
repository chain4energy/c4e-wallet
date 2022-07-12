import {defineStore} from "pinia";
import { rewards, Validator } from "@/models/validator";
import apiFactory from "@/api/factory.api";
import {useTokensStore} from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { Validators } from "@/models/validators";
import { stackingList, stackItem } from "@/models/stacking";

interface ValidatorsState {
  validators: Validators,
  numberOfActiveValidators: number,
  rewardsFetched: boolean,
  stackingFetch: boolean,
  validatorsFetched: boolean,
  validatorsWithReward: Array<Validator>,
}

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: (): ValidatorsState => {
    return {
      validators: Object() as Validators,
      numberOfActiveValidators: Object(Number),
      rewardsFetched: false,
      stackingFetch: false,
      validatorsFetched: false,
      validatorsWithReward: Array<Validator>()
    };
  },
  actions: {
    async fetchValidators(){
      await useTokensStore().fetchStakingPool()
      this.rewardsFetched = false;
      this.stackingFetch = false;
      await apiFactory.validatorsApi().fetchAllValidators(null, true, null)
        .then((responce) => {
          if(responce.data){
            responce.data.validators.forEach((el) =>{
              const votingPower = (Number(el.tokens) / Number(useTokensStore().getStakingPool.bonded_tokens)) * 100;
              el.votingPower = Number(votingPower);
              el.status = this.setStatus(el);
              this.setStacked(el, useUserStore().getStackedList);
              el.stackedIndicator = true;
              this.setRewards(el);
            })
            this.validators = responce.data
            this.sortValidators()
            this.stackingFetch = true
          } else {
            this.validators = Object(Validators)
            this.stackingFetch = false
          }
        })
    },
    setStatus(el:Validator){
      switch (el.status) {
        case 'BOND_STATUS_UNSPECIFIED' || 0:
          el.status = 'Invalid';
          return el.status;
        case 'BOND_STATUS_UNBONDED' || 1:
          el.status = 'NotBounded';
          return el.status;
        case 'BOND_STATUS_UNBONDING' || 2:
          el.status = 'inProccess';
          return el.status;
        case 'BOND_STATUS_BONDED' || 3:
          el.status = 'Active';
          return el.status;
        default:
          return 'Checking';
      }
    },
    fetchNumberOfActiveValidators(){
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
    sortValidators(){
      const validatorsValues: Array<number> = []
      const sortedValidators: Array<Validator> = []
      this.validators.validators.forEach((el: Validator)=> {
        validatorsValues.push(Number(el.tokens))
      })
      let id = 1;
      const o = validatorsValues.length
      for (let i = 0; i < o; i++) {
        const max = Math.max(...validatorsValues)
        const element = this.validators.validators.find((element: Validator)=> Number(element.tokens) === max )
        if (element != undefined) {
          element.id = id
          id += 1;
          sortedValidators.push(element)
          validatorsValues.splice(validatorsValues.indexOf(max),1);
        }
      }
      this.validators.validators = sortedValidators
    },
    setStacked(el:Validator, stackedList: stackingList ){
      if(useUserStore().isLoggedIn && stackedList){
        const data = stackedList.delegation_responses
          .find((stackD: stackItem) => stackD.delegation.validator_address === el.operator_address)
        if(data){
          el.stacked = data.balance
        } else {
          el.stacked = {
            amount: '0',
            denom: '',
          }
        }
      } else {
        el.stacked = {
          amount: '0',
          denom: '',
        }
      }
    },
    setRewards(el: Validator){
      if(useUserStore().isLoggedIn && useUserStore().getRewardList){
        const data = useUserStore().getRewardList.rewards
          .find((reward: rewards) => reward.validator_address === el.operator_address)
        if(data !== undefined){
          el.rewards = data.reward[0]
        } else {
          el.rewards = {
            amount: '0',
            denom: 'c4e'
          }
        }
        this.rewardsFetched = true;
      } else {
        this.rewardsFetched = false
      }
    },
    logoutValidatorModule(){
      this.stackingFetch = false;
      this.rewardsFetched = false;
      this.validatorsWithReward = [];
    }
  },
  getters: {
    getValidators(): Validators{
     return this.validators;
    },
    getActiveValidators(): number {
      return this.numberOfActiveValidators;
    },
    getRewardsFetchetStatus() : boolean {
      return this.rewardsFetched;
    },
    getValidatorsWithReward(): Array<Validator>{
      return this.validatorsWithReward;
    },
    getStackingFetchResult(): boolean{
      return this.stackingFetch;
    }
  }
});
