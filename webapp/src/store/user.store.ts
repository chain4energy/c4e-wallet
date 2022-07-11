import { defineStore } from "pinia";
import { Account, AccountType } from "@/models/store/account";
import apiFactory from "@/api/factory.api";
import { ConnectionInfo, ConnectionError } from "@/api/wallet.connecton.api";
import { useValidatorsStore } from "@/store/validators.store";
import { Rewards } from "@/models/validator";
import { stackingList } from "@/models/stacking";
import { useToast } from "vue-toastification";
import { RequestResponse } from '@/models/request-response';

const toast = useToast();

interface UserState {
  logged: ConnectionInfo
  account: Account
  // type: string
  balances: number
  stacked: number
  unstacked: number
  totalRewards: number
  vestimgAccLocked: number
  rewards: Rewards
  _isLoggedIn: boolean
  basicAccount: boolean
  vestingAccount: boolean
  stackingList: stackingList
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => {
    return {
      logged: Object(),
      account: Object(),
      // type: '',
      balances: 0,
      stacked: 0,
      unstacked: 0,
      totalRewards: 0,
      vestimgAccLocked: Number(),
      rewards: Object(),
      _isLoggedIn: false,
      basicAccount: false,
      vestingAccount: false,
      stackingList: Object(),
    };
  },
  actions: {

    async connectKeplr() {
      await this.connect(apiFactory.walletApi().connectKeplr())
    },
    async connectAsAddress(address: string) {
      await this.connect(apiFactory.walletApi().connectAddress(address))
    },
    async connect(connectionResponse: Promise<RequestResponse<ConnectionInfo, ConnectionError>>) {
      await connectionResponse.then(async (response) => {
        if (response.isError() || response.data === undefined) {
          this._isLoggedIn = false;
        } else {
          this.logged = response.data
          this._isLoggedIn = true;
          this.fetchAccountData()
        }
      })
    },
    async fetchAccountData() {
      if (!this._isLoggedIn) {
        return
      }
      const id = this.logged.account;
      await apiFactory.accountApi().fetchAccount(id).then(async response => {
        if (response.isSuccess() && response.data !== undefined) {
          const account = response.data;
          this.account = account;
          if (account.type !== AccountType.Nonexistent) {
            await this.fetchBalance(id);
            await this.fetchRewards(id);
            await this.fetchStackedAmount(id);
            await this.fetchUnstackedAmount(id);
            await useValidatorsStore().fetchValidators();
            localStorage.setItem('account', account.address);
          } else {
            // TODO clear store
          }
        }
      })
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
    async calculateVestingLocked(latestBlTime: string){ // TODO number to BigInt
      const validtime = await Date.parse(latestBlTime);
      const startTime = Number(this.account?.continuousVestingData?.startTime);
      const endTime = Number(this.account?.continuousVestingData?.endTime);
      const origVesting = Number(this.account?.continuousVestingData?.originalVesting[0].amount) // TODO getting by denom
      if (validtime <= startTime) {
        this.vestimgAccLocked =  origVesting;
        return
      }
      if (validtime >= endTime) {
        this.vestimgAccLocked = 0;
        return;
      }
      const x = validtime - startTime
      const y = endTime - startTime
      const diference = x/y;
      const unlocked = origVesting * diference
      console.log(origVesting * diference)
      const locked = origVesting - unlocked
      this.vestimgAccLocked = locked;
    },
    async fetchUnstackedAmount(id: string){
      await apiFactory.accountApi().fetchUnstackedTokens(id)
        .then(response => {
          const totalUnstacked = []
          if(response.data.unbonding_responses.length > 0){
            for (const element of response.data.unbonding_responses[0].entries){
              totalUnstacked.push(parseInt(element.balance))
            }
            this.unstacked= totalUnstacked.reduce(
              (previousValue, currentValue) => previousValue + currentValue, 0);
          } else {
            this.unstacked = 0;
          }
        });
    },
    async fetchRewards(id: string){
      await apiFactory.accountApi().fetchRewards(id)
        .then(response => {
          this.rewards = response.data
          if(response.data.rewards.length > 0){
            const rew = response.data.total[0].amount;
            this.totalRewards = parseFloat(rew);
          } else {
            this.totalRewards = 0;
          }
        })
    },
    async delegate(validator: string, amount: string) {
      await apiFactory.accountApi().delegate(this.logged, validator, amount).then(async (resp) => {
        if (resp.isError()) {
          toast.error('delegate failed')
        } else {
          // TODO refresh data ??
        }
      })
    },
    async redelegate(validatorSrc: string, validatorDst: string, amount: string) {
      await apiFactory.accountApi().redelegate(this.logged, validatorSrc, validatorDst, amount).then(async (resp) => {
        if (resp.isError()) {
          toast.error('redelegate failed')
        } else {
          // TODO refresh data ??
        }
      })
    },
    async undelegate(validator: string, amount: string) {
      await apiFactory.accountApi().undelegate(this.logged, validator, amount).then(async (resp) => {
        if (resp.isError()) {
          toast.error('undelegate failed')
        } else {
          // TODO refresh data ??
        }
      })
    },
    async claimRewards() {
      const validators = await useValidatorsStore().getValidatorsWithReward;
      apiFactory.accountApi().claimRewards(this.logged, validators).then(async (resp) => {
        if (resp.isError()) {
          toast.error('claimRewards failed')
        } else {
          // TODO refresh data ??
        }
      })
    },
    async vote(option: number, proposalId: number){
      apiFactory.accountApi().vote(this.logged, option, proposalId).then(async (resp) => {
        if (resp.isError()) {
          toast.error('vote failed')
        } else {
          // TODO refresh data ??
        }
      })
    },
    async logOut(){
      this._isLoggedIn = false;
      this.logged = Object(),
      this.account = Object();
      await useValidatorsStore().logoutValidatorModule()
      localStorage.removeItem('account')
    },
  },
  getters: {
    isLoggedIn (): boolean {
       return this._isLoggedIn;
    },
    getAccount(): Account {
      return this.account;
    },
    isContinuousVestingAccount(): boolean {
      return this.account.type === AccountType.ContinuousVestingAccount;
    },
    getAccType(): AccountType {
      return this.account.type;
    },
    getBalances(): number {
      return this.balances;
    },
    getRewards(): number {
      return this.totalRewards;
    },
    getRewardList():Rewards {
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
    getVestingLockAmount() : number{
      return this.vestimgAccLocked
    }
  },
});
