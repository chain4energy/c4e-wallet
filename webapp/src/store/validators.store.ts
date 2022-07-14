import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { useUserStore } from "@/store/user.store";
import { Validator, ValidatorStatus } from "@/models/store/validator";

interface ValidatorsState {
  validators: Validator[]
  numberOfActiveValidators: number
  // rewardsFetched: boolean
  // stackingFetch: boolean
  // validatorsWithReward: Array<Validator>
}

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: (): ValidatorsState => {
    return {
      validators: Array<Validator>(),
      // validator: Object,
      numberOfActiveValidators: 0,
      // rewardsFetched: false,
      // stackingFetch: false,
      // validatorsWithReward: Array<Validator>()
    };
  },
  actions: {
    async fetchValidators(){
      // this.rewardsFetched = false;
      // this.stackingFetch = false;
      // let validatorsList = Object() as Validators;
      await apiFactory.validatorsApi().fetchAllValidators(null, true, null)
        .then((resp) => {
          if (resp.isSuccess() && resp.data !== undefined){
            this.validators = resp.data.validators;
            this.numberOfActiveValidators = resp.data.numberOfActive
          } else {
            // TODO
          }
      });

      // this.validators = await this.setVotingPower(validatorsList);
      // await this.sortValidators()
      // await useValidatorsStore().setStatusAndId();
      // if(useUserStore().isLoggedIn && useUserStore().getRewardList) {
      //   await useUserStore().fetchRewards(useUserStore().getAccount.address);
      //   this.stackingFetch = this.setStacked();
      //   this.rewardsFetched = this.setRewards()
      // }

    },
    // async fetchValidatorsfff(){
    //   this.rewardsFetched = false;
    //   this.stackingFetch = false;
    //   let validatorsList = Object() as Validators;
    //   await apiFactory.validatorsApi().fetchAllValidators(null, true, null)
    //     .then((resp) => {
    //       if (resp.data){
    //         validatorsList = resp.data;
    //       }
    //   });

    //   this.validators = await this.setVotingPower(validatorsList);
    //   await this.sortValidators()
    //   await useValidatorsStore().setStatusAndId();
    //   if(useUserStore().isLoggedIn && useUserStore().getRewardList) {
    //     await useUserStore().fetchRewards(useUserStore().getAccount.address);
    //     this.stackingFetch = this.setStacked();
    //     this.rewardsFetched = this.setRewards()
    //   }

    // },
    // setStatusAndId() {
    //   let id = 1;
    //   this.validators.validators.forEach((element: Validator) => {
    //     element.id = id;
    //     id += 1;
    //     switch (element.status) {
    //       case 'BOND_STATUS_UNSPECIFIED' || 0:
    //         element.status = 'Invalid';
    //         return element.status;
    //       case 'BOND_STATUS_UNBONDED' || 1:
    //         element.status = 'NotBounded';
    //         return element.status;
    //       case 'BOND_STATUS_UNBONDING' || 2:
    //         element.status = 'inProccess';
    //         return element.status;
    //       case 'BOND_STATUS_BONDED' || 3:
    //         element.status = 'Active';
    //         return element.status;
    //       default:
    //         return 'Checking';
    //     }
    //   });
    // },
    // async setVotingPower(validators : Validators) {
    //   if(useTokensStore().getStakingPool.bonded_tokens){
    //     const supply = await useTokensStore().getStakingPool;
    //     const total = Number(supply.bonded_tokens);
    //     validators.validators.forEach((element:Validator) => {
    //       const votingPower = (Number(element.tokens) / total) * 100;
    //       element.votingPower = Number(votingPower);
    //       return element;
    //     });
    //     return validators;
    //   }
    //   else {
    //     useTokensStore().fetchStakingPool()
    //     return validators;
    //   }
    // },

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
    // setRewards(){
    //   const rewards = useUserStore().getRewardList
    //   if(useUserStore().getRewardList && useUserStore().getAccount){
    //     for (const el of this.validators.validators) {
    //       const rew = rewards.rewards.filter(
    //         (element) => element.validator_address === el.operator_address,
    //         this.validatorsWithReward.push(el)
    //       );
    //       if (rew[0]) {
    //         // eslint-disable-next-line prefer-destructuring
    //         el.rewards = rew[0].reward[0];
    //       } else {
    //         el.rewards = {
    //           amount: '0',
    //           denom: '',
    //         };
    //       }
    //     }
    //     return true
    //   }else {
    //     useUserStore().fetchAccountData()
    //     return false
    //   }
    // },
    // sortValidators(){
    //   const validatorsValues: Array<number> = []
    //   const sortedValidators: Array<Validator> = []
    //   this.validators.validators.forEach((el: Validator)=> {
    //     validatorsValues.push(Number(el.tokens))
    //   })
    //   let id = 1;
    //   const o = validatorsValues.length
    //   for (let i = 0; i < o; i++) {
    //     const max = Math.max(...validatorsValues)
    //     const element = this.validators.validators.find((element: Validator)=> Number(element.tokens) === max )
    //     if (element != undefined) {
    //       element.id = id
    //       id += 1;
    //       sortedValidators.push(element)
    //       validatorsValues.splice(validatorsValues.indexOf(max),1);
    //     }
    //   }
    //   this.validators.validators = sortedValidators
    // },
    // setStacked() {
    //   const stacked = useUserStore().getStackedList
    //   console.log(stacked)
    //   if(stacked.delegation_responses.length > 0){
    //     for(const el of this.validators.validators){
    //       const data = stacked.delegation_responses.find((stackD: stackItem) => stackD.delegation.validator_address === el.operator_address)
    //       if(data){
    //         el.stacked = data.balance
    //       } else {
    //         el.stacked = {
    //           amount: '0',
    //           denom: '',
    //         }
    //       }
    //     }
    //     return true
    //   } else {
    //     for(const el of this.validators.validators){
    //       el.stacked = {
    //         amount: '0',
    //         denom: '',
    //       }
    //     }
    //     return true
    //   }
    // },
    // logoutValidatorModule(){
    //   this.stackingFetch = false;
    //   this.rewardsFetched = false;
    //   this.validatorsWithReward = [];
    //   this.fetchValidators()
    // }
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
    // getRewardsFetchetStatus() : boolean {
    //   return this.rewardsFetched;
    // },
    // getValidatorsWithReward(): Array<Validator>{
    //   return this.validatorsWithReward;
    // },
    // getStackingFetchResult(): boolean{
    //   return this.stackingFetch;
    // }
  }
});
