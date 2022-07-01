import {defineStore} from "pinia";
import {DataHolder} from "@/models/data-holder";
import { BasicQuantity, Rewards, rewards, Validator } from "@/models/validator";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import apiFactory from "@/api/factory.api";
import {useTokensStore} from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { logs } from "@cosmjs/stargate";
import { Validators } from "@/models/validators";
import { stackItem } from "@/models/stacking";
import { useKeplrStore } from "@/store/keplr.store";

export const useValidatorsStore = defineStore({
  id: 'validatorsStore',
  state: () => {
    return {
      validators: Object(Validators),
      validator: Object,
      numberOfActiveValidators: Object(Number),
      rewardsFetched: false,
      stackingFetch: false
    };
  },
  actions: {
    async fetchValidators(){
      this.rewardsFetched = false;
      this.stackingFetch = false;
      let validatorsList = Object() as Validators;
      await apiFactory.validatorsApi().fetchAllValidators(null, true, null)
        .then((resp) => {
          if (resp.data){
            validatorsList = resp.data;
          }
      });

      this.validators = await this.setVotingPower(validatorsList);
      await useValidatorsStore().setStatusAndId();
      if(useUserStore().isLoggedIn) {
        await useUserStore().fetchRewards(useUserStore().getAccount.address);
        this.setStacked();
        this.rewardsFetched = this.setRewards()
      }
    },

    // fetchValidators: async function(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null) {
    //   await useTokensStore().fetchTotalSupply();
    //   apiFactory.validatorsApi().fetchAllValidators(pagination, lockScreen, localSpinner)
    //     .then(async (response) => {
    //         if (response.error == null && response.data != undefined) {
    //           const total = await useTokensStore().getTotalSupply;
    //           let rewards;
    //           const acc = await useUserStore().getAccount;
    //           if(acc.address){
    //             const account = useUserStore().getAccount.address;
    //             rewards = await useUserStore().fetchRewards(account);
    //           } else {
    //             rewards = {
    //               reward:[{
    //                 amount: '0',
    //                 denom: '',
    //               }],
    //               validator_address: '',
    //             };
    //           }
    //           const dataHolder = new DataHolder<Validator>();
    //           let id = 1;
    //           for (const element of response.data.validators) {
    //             element.vp = element.tokens / Math.floor(total.amount) * 100;
    //             element.userSpend = '0';
    //             element.status = await this.checkStatus(element.status);
    //             element.id = id;
    //             id += 1;
    //             if (rewards){
    //               const rew = rewards.reward.filter((el: any) => {
    //                   return el.validator_address === element.operator_address;
    //                 },
    //               );
    //               if (rew[0]) {
    //                 // eslint-disable-next-line prefer-destructuring
    //                 return element.rewards = rew[0];
    //             } else {
    //               return rewards = {
    //                 reward:[{
    //                   amount: '0',
    //                   denom: '',
    //                 }],
    //                 validator_address: '',
    //               };
    //               }
    //             }
    //
    //             dataHolder.elements.push(element);
    //             element.rewards = rewards;
    //           }
    //           dataHolder.amount = Number(response.data.pagination.total);
    //           this.validators = dataHolder;
    //         } else {
    //           //TODO: error handling
    //         }
    //       }
    //     );
    // },
    setStatusAndId() {
      let id = 1;
      this.validators.validators.forEach((element: Validator) => {
        element.id = id;
        id += 1;
        switch (element.status) {
          case 'BOND_STATUS_UNSPECIFIED' || 0:
            element.status = 'Invalid';
            return element.status;
          case 'BOND_STATUS_UNBONDED' || 1:
            element.status = 'NotBounded';
            return element.status;
          case 'BOND_STATUS_UNBONDING' || 2:
            element.status = 'inProccess';
            return element.status;
          case 'BOND_STATUS_BONDED' || 3:
            element.status = 'Active';
            return element.status;
          default:
            return 'Checking';
        }
      });
    },
    async setVotingPower(validators : Validators) {
      if(useTokensStore().getTotalSupply.amount){
        const supply = await useTokensStore().getTotalSupply;
        const total = Number(supply.amount);
        validators.validators.forEach((element:Validator) => {
          const votingPower = (Number(element.tokens) / total) * 100;
          element.votingPower = Number(votingPower);
          return element;
        });
        return validators;
      }
      else {
        useTokensStore().fetchTotalSupply()
        return validators;
      }

    },

    fetchNumberOfActiveValidators(){
      apiFactory.validatorsApi().fetchActiveValidatorCount().then((response)=>{
        if( response.error == null ) {
          this.numberOfActiveValidators = response.data?.data.activeTotal.aggregate.count;
        } else {
          //TODO: error handling
        }
      });
    },
    setRewards(){
      const rewards = useUserStore().getRewardList
      if(useUserStore().getRewardList && useUserStore().getAccount){
        for (const el of this.validators.validators) {
          const rew = rewards.rewards.filter(
            (element) => element.validator_address === el.operator_address,
          );
          if (rew[0]) {
            // eslint-disable-next-line prefer-destructuring
            el.rewards = rew[0].reward[0];
          } else {
            el.rewards = {
              amount: '0',
              denom: '',
            };
          }
        }
        return true
      }else {
        useKeplrStore().checkKeplr()
        return false
      }
    },
    setStacked() {
      const stacked = useUserStore().getStackedList
      if(stacked.delegation_responses.length > 0){
        for(const el of this.validators.validators){
          const data = stacked.delegation_responses.find((stackD: stackItem) => stackD.delegation.validator_address === el.operator_address)
          if(data){
            el.stacked = data.balance
          } else {
            el.stacked = {
              amount: '0',
              denom: '',
            }
          }
        }
        this.stackingFetch = true;
      }
    },
    logoutValidatorModule(){
      this.stackingFetch = false;
      this.rewardsFetched = false;
      this.fetchValidators()
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
    getStackingFetchResult(): boolean{
      return this.stackingFetch;
    }
  }
});
