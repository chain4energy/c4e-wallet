import { defineStore } from "pinia";
import { Account, account } from "@/models/account";
import apiFactory from "@/api/factory.api";
import { useKeplrStore } from "@/store/keplr.store";
import { Amount } from "@/models/TotalSupply";
import { useValidatorsStore } from "@/store/validators.store";
import { Rewards } from "@/models/validator";
import { stackingList } from "@/models/stacking";

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    return {
      account: Object() as account,
      type: '',
      balances: 0,
      stacked: 0,
      unstacked: 0,
      totalRewards: 0,
      rewards: Object() as Rewards,
      _isLoggedIn: false,
      basicAccount: false,
      vestingAccount: false,
      stackingList: Object() as stackingList,
    };
  },
  actions: {

    typeShow(type: string){
      console.log(type);
    },
    async fetchAccount(id: string) {
      await apiFactory.accountApi().fetchAccount(id).then(response => {
        if (response.error == null && response.data != undefined) {
          const account:Account = response.data;
          this.account = account.account;
          this.type = account.account["@type"]
          this._isLoggedIn = true;
          this.fetchBalance(id);
          this.fetchRewards(id);
          this.fetchStackedAmount(id);
          this.fetchUnstackedAmount(id);
          useValidatorsStore().fetchValidators()
          localStorage.setItem('account', account.account.address);
        } else {
          this._isLoggedIn = false;
        }
      });
    },
    async fetchBalance(id: string) {
      await apiFactory.accountApi().fetchBalances(id)
        .then(response => {
          const balance: any = response.data;
          this.balances = parseFloat(balance.balances[0].amount);
        });
    },
    async fetchStackedAmount(id: string) {
      await apiFactory.accountApi().fetchStackedTokens(id)
        .then(response => {
          this.stackingList = response.data;
          const totalStacked = [];
          for (const element of response.data.delegation_responses){
            totalStacked.push( parseInt(element.balance.amount));
          }
          const sumWithInitial = totalStacked.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          );
          this.stacked= sumWithInitial;
        });
    },
    async fetchUnstackedAmount(id: string){
      await apiFactory.accountApi().fetchUnstackedTokens(id)
        .then(response => {
          console.log(response.data.unbonding_responses[0].entries);
          const totalUnstacked = []
          for (const element of response.data.unbonding_responses[0].entries){
            totalUnstacked.push(parseInt(element.balance))
          }
          this.unstacked= totalUnstacked.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          );
        });
    },
    async fetchRewards(id: string){
      await apiFactory.accountApi().fetchRewards(id)
        .then(response => {
          this.rewards = response.data
          const rew = response.data.total[0].amount;
          this.totalRewards = parseFloat(rew);
        })
    },
    async logOut(){
      this._isLoggedIn = false;
      this.account = Object() as account;
      await useKeplrStore().logOutKeplr();
      await useValidatorsStore().logoutValidatorModule()
    }
  },
  getters: {
    isLoggedIn (): boolean {
       return this._isLoggedIn;
    },
    getAccount(): account{
      return this.account;
    },
    getAccType(): string {
      return this.type;
    },
    getBalances(): number{
      return this.balances;
    },
    getRewards(): number {
      return this.totalRewards;
    },
    getRewardList():Rewards{
      return this.rewards;
    },
    getStacked(): number {
      return this.stacked;
    },
    getUnstacked(): number{
      return this.unstacked;
    },
    getStackedList(): stackingList{
      return this.stackingList
    },
    // getBalance(): balances {
    //   return this.balance
    // }
  },
  // persist: {
  //   enabled: true
  // }
});

// function decodeToken (accessToken: string) : any {
//   const base64Url = accessToken.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
//     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));
//   return JSON.parse(jsonPayload);
// }
