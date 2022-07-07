import { defineStore } from "pinia";
import { Account, account } from "@/models/account";
import apiFactory from "@/api/factory.api";
import walletService from "@/services/walletService"
import { KeplrResponce } from "@/models/keplr";
import { useValidatorsStore } from "@/store/validators.store";
import { Rewards } from "@/models/validator";
import { stackingList } from "@/models/stacking";
import { useToast } from "vue-toastification";
import { transaction } from "@/models/transaction";
import { ClaimRewards, DelegetionMsg, VoteMsg } from "@/services/wallet/messages";
import { keplrConfig } from "@/config/keplrConfigTest";
const toast = useToast();

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
      vestimgAccLocked: Number() as number,
      rewards: Object() as Rewards,
      _isLoggedIn: false,
      basicAccount: false,
      vestingAccount: false,
      stackingList: Object() as stackingList,
    };
  },
  actions: {
    async fetchAccount() {
      await walletService.checkWallet().then(async (response) => {
        if (response.err) {
          this._isLoggedIn = false;
        } else {
          const id =response.address;
          await apiFactory.accountApi().fetchAccount(id).then(async response => {
            if (response.error == null && response.data != undefined) {
              const account: Account = response.data;
              this.account = account.account;
              if (account.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
                this.account.address = account.account.base_vesting_account.base_account.address
              } else {
                this.account.address = account.account.address
              }
              this.type = account.account["@type"]
              this._isLoggedIn = true;

              await this.fetchBalance(id);
              await this.fetchRewards(id);
              await this.fetchStackedAmount(id);
              await this.fetchUnstackedAmount(id);
              await useValidatorsStore().fetchValidators()
              localStorage.setItem('account', account.account.address);
            } else {
              this._isLoggedIn = false;
            }
          });
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
    async calculateVestingLocked(latestBlTime: string){
      const validtime = await Date.parse(latestBlTime)/1000
      const x = validtime - Number(this.account.start_time)
      const y = Number(this.account.base_vesting_account.end_time) - Number(this.account.start_time)
      const diference = x/y;
      const unlocked = Number(this.account.base_vesting_account.original_vesting[0].amount) * diference
      console.log(this.account.base_vesting_account.original_vesting[0].amount * diference)
      const locked = Number(this.account.base_vesting_account.original_vesting[0].amount) - unlocked
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
    async tokensTransaction(transaction :transaction): Promise<void>{
      await walletService.getOfflineSigner(keplrConfig).then(async (responce) => {
        if (responce) {
          transaction.delegatorAddress = this.account.address
          const msg = await new DelegetionMsg(transaction, keplrConfig)
          const result = await responce.client.signAndBroadcast(responce.account, [msg.delegation], msg.fee, '');
          return result
        } else {
          toast.error('transaction Failed')
        }
      })
    },
    async claimReawards() {
      walletService.getOfflineSigner(keplrConfig).then(async (responce) => {
        if (responce) {
          const validators = await useValidatorsStore().getValidatorsWithReward;
           const fee = {
            amount: [{
              denom: 'uc4e',
              amount: '0',
            }],
            gas: '2500000',
          };
          const messages = []
          for (const element of validators) {
            const msg = new ClaimRewards(responce.account, element.operator_address, keplrConfig)
            messages.push(msg.rewardMSG)
          }
          const result = responce.client.signAndBroadcast(responce.account, messages, fee, '');
          return result
        } else {
          toast.error('Claiming rewards failed')
        }
      })
    },
    async voting(option: number, proposalId: number){
      walletService.getOfflineSigner(keplrConfig).then(async (responce) => {
        if (responce) {
          const msg = new VoteMsg(option, proposalId, responce.account, keplrConfig);
          const result = responce.client.signAndBroadcast(responce.account, msg.votingMSG, msg.fee, '');
          return result
        } else {
          toast.error('Claiming rewards failed')
        }
      })
    },
    async logOut(){
      this._isLoggedIn = false;
      this.account = Object() as account;
      await useValidatorsStore().logoutValidatorModule()
      localStorage.removeItem('account')
    },
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
    getVestingLockAmount() : number{
      return this.vestimgAccLocked
    }
  },
});
