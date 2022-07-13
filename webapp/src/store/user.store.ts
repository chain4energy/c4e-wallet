import { defineStore } from "pinia";
import { Account, AccountType } from "@/models/store/account";
import apiFactory from "@/api/factory.api";
import { ConnectionInfo, ConnectionError } from "@/api/wallet.connecton.api";
import { useValidatorsStore } from "@/store/validators.store";
import { useToast } from "vue-toastification";
import { RequestResponse } from '@/models/request-response';
import { useConfigurationStore } from "./configuration.store";
import { Delegation, Delegations } from "@/models/store/staking";
import { Rewards, ValidatorRewards } from "@/models/store/distribution";

const toast = useToast();

interface UserState {
  logged: ConnectionInfo
  account: Account
  // type: string
  balances: number
  // stacked: number
  unstacked: number
  // totalRewards: number
  vestimgAccLocked: number
  rewards: Rewards
  _isLoggedIn: boolean
  delegations: Delegations
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => {
    return {
      logged: Object(),
      account: Object(),
      // type: '',
      balances: 0,
      // stacked: 0,
      unstacked: 0,
      vestimgAccLocked: Number(),
      rewards: new Rewards(new Map<string, ValidatorRewards>(), 0),
      _isLoggedIn: false,
      delegations: new Delegations(new Map<string, Delegation>(), 0),
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
            await this.fetchDelegations(id);
            await this.fetchUnstackedAmount(id);
            // await useValidatorsStore().fetchValidators();
            localStorage.setItem('account', account.address);
          } else {
            // TODO clear store
          }
        }
      })
    },
    async fetchBalance(address: string) {
      const denom = useConfigurationStore().config.stakingDenom
      await apiFactory.accountApi().fetchBalance(address, denom)
        .then(response => {
          if (response.isSuccess() && response.data !== undefined) {
            const balance = response.data;
            this.balances = parseInt(balance.amount); // TODO use bigint recalculate with decimal
          } else {
            // TODO
          }
        });
    },
    async fetchDelegations(address: string) {
      await apiFactory.accountApi().fetchDelegations(address)
        .then(response => {
          if (response.isSuccess() && response.data !== undefined) {
            this.delegations = response.data
          } else {
            // TODO
          }
          // this.stackingList = response.data;
          // const totalStacked = [];
          // for (const element of response.data.delegation_responses){
          //   totalStacked.push( parseInt(element.balance.amount));
          // }
          // const sumWithInitial = totalStacked.reduce(
          //   (previousValue, currentValue) => previousValue + currentValue,
          //   0
          // );
          // this.stacked= sumWithInitial;
        });
    },
    async calculateVestingLocked(latestBlTime: string){ // TODO number to BigInt
      const validtime = await Date.parse(latestBlTime);
      const endTime = Number(this.account?.continuousVestingData?.endTime);
      if (validtime >= endTime) {
        this.vestimgAccLocked = 0;
        return;
      }
      const startTime = Number(this.account?.continuousVestingData?.startTime);
      const denom = useConfigurationStore().config.stakingDenom
      const origVesting = Number(this.account?.continuousVestingData?.getOriginalVestingByDenom(denom).amount)
      if (validtime <= startTime) {
        this.vestimgAccLocked =  origVesting;
        return
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
          if (response.isSuccess() && response.data !== undefined) {
            this.rewards = response.data
          } else {
            // TODO
          }

          // this.rewards = response.data
          // if(response.data.rewards.length > 0){
          //   const rew = response.data.total[0].amount;
          //   this.totalRewards = parseFloat(rew);
          // } else {
          //   this.totalRewards = 0;
          // }
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
      const validators = this.rewards.getAllValidatorsAddresses();
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
      // await useValidatorsStore().logoutValidatorModule()
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
      return this.rewards.totalRewards;
    },
    getRewardList():Rewards {
      return this.rewards;
    },
    // getStacked(): number {
    //   return this.stacked;
    // },
    getUnstacked(): number{
      return this.unstacked;
    },
    // getStackedList(): stackingList{
    //   return this.stackingList
    // },
    getDelegations(): Delegations {
      return this.delegations
    },
    getVestingLockAmount() : number{
      return this.vestimgAccLocked
    }
  },
});
