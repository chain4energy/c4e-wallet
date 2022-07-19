import { defineStore } from "pinia";
import { Account, AccountType } from "@/models/store/account";
import apiFactory from "@/api/factory.api";
import { ConnectionInfo, ConnectionError, ConnectionType } from "@/api/wallet.connecton.api";
import { useToast } from "vue-toastification";
import { RequestResponse } from '@/models/request-response';
import { useConfigurationStore } from "./configuration.store";
import { Delegations, UnbondingDelegations } from "@/models/store/staking";
import { Rewards } from "@/models/store/distribution";
import { VoteOption } from "@/api/account.api";
import { TxBroadcastError, TxData } from "@/api/tx.broadcast.base.api";

const toast = useToast();

interface UserState {
  connectionInfo: ConnectionInfo
  account: Account
  balance: number
  vestimgAccLocked: number
  rewards: Rewards
  _isLoggedIn: boolean
  delegations: Delegations
  undelegations: UnbondingDelegations
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => {
    return {
      connectionInfo: ConnectionInfo.disconnected,
      account: Object(), // TODO probably type - Account | null
      balance: 0,
      vestimgAccLocked: 0,
      rewards: new Rewards(),
      _isLoggedIn: false,
      delegations: new Delegations(),
      undelegations: new UnbondingDelegations(),

    };
  },
  actions: {
    async reconectAcc(){
      if(this.connectionInfo.connectionType === 1){
        await this.connect(apiFactory.walletApi().connectKeplr())
      } else if(this.connectionInfo.connectionType === 0){
        await this.connect(apiFactory.walletApi().connectAddress(this.connectionInfo.account))
      } else return
    },
    async connectKeplr() {
      await this.connect(apiFactory.walletApi().connectKeplr())
    },
    async connectAsAddress(address: string) {
      // TODO address validations
      await this.connect(apiFactory.walletApi().connectAddress(address))
    },
    async connect(connectionResponse: Promise<RequestResponse<ConnectionInfo, ConnectionError>>) {
      await connectionResponse.then(async (response) => {
        if (response.isError() || response.data === undefined) {
          toast.error('Connection failed');
          clearStateOnLogout(this);
        } else {
          this.connectionInfo = response.data;
          const address = this.connectionInfo.account;
          await this.fetchAccountData();
          if (this._isLoggedIn) {
            toast.success('Address: "' + address + '" Connected');
          } else {
            toast.error('Address: "' + address + '" Connection failed');
          }
        }
      })
    },
    async fetchAccountData() {
      const connectionInfo = this.connectionInfo;
      if (!checkIfConnected(connectionInfo)) {
        return false
      }

      await apiFactory.accountApi().fetchAccount(connectionInfo.account).then(async response => {
        if (response.isSuccess() && response.data !== undefined) {
          const account = response.data;
          this.account = account;
          if (account.type !== AccountType.Nonexistent) {
            const allResults = await Promise.all([
              fetchBalance(connectionInfo, this),
              fetchRewards(connectionInfo, this),
              fetchDelegations(connectionInfo, this),
              fetchUnbondingDelegations(connectionInfo, this),
            ]);
            if (!allResults.every(r => r)) {
              clearStateOnLogout(this);
              return
            }
          } else {
            clearStateForNonexistentAccount(this)
          }
          this._isLoggedIn = true;
        } else {
          clearStateOnLogout(this);
        }
      })
    },
    // async fetchBalance(): Promise<boolean> {
    //   if (!checkIfConnected(this.connectionInfo)) {
    //     return false
    //   }
    //   return await fetchBalance(this.connectionInfo, this)
    // },
    // async fetchDelegations() {
    //   if (!checkIfConnected(this.connectionInfo)) {
    //     return false
    //   }
    //   return await fetchDelegations(this.connectionInfo, this)
    // },
    async calculateVestingLocked(latestBlTime: string){ // TODO number to BigInt
      if (!checkIfConnected(this.connectionInfo)) {
        this.vestimgAccLocked = 0;
        return
      }
      if (!this._isLoggedIn || this.account.type !== AccountType.ContinuousVestingAccount ) {
        this.vestimgAccLocked = 0;
        return
      }
      if (this.account?.continuousVestingData !== undefined) {
        this.vestimgAccLocked = this.account.continuousVestingData.calculateVestingLocked(latestBlTime);
      } else {
        this.vestimgAccLocked = 0;
        // TODO some error toast maybe
      }
      // const validtime = await Date.parse(latestBlTime);
      // const endTime = Number(this.account?.continuousVestingData?.endTime);
      // if (validtime >= endTime) {
      //   this.vestimgAccLocked = 0;
      //   return;
      // }
      // const startTime = Number(this.account?.continuousVestingData?.startTime);
      // const denom = useConfigurationStore().config.stakingDenom
      // const origVesting = Number(this.account?.continuousVestingData?.getOriginalVestingByDenom(denom).amount)
      // if (validtime <= startTime) {
      //   this.vestimgAccLocked =  origVesting;
      //   return
      // }

      // const x = validtime - startTime
      // const y = endTime - startTime
      // const diference = x/y;
      // const unlocked = origVesting * diference
      // console.log(origVesting * diference)
      // const locked = origVesting - unlocked
      // this.vestimgAccLocked = locked;
    },

    // async fetchUnbondingDelegations(){
    //   if (!checkIfConnected(this.connectionInfo)) {
    //     return false
    //   }
    //   return await fetchUnbondingDelegations(this.connectionInfo, this)
    // },
    // async fetchRewards(){
    //   if (!checkIfConnected(this.connectionInfo)) {
    //     return false
    //   }
    //   return await fetchRewards(this.connectionInfo, this)
    // },
    async delegate(validator: string, amount: string) {
      const connectionInfo = this.connectionInfo;
      await apiFactory.accountApi().delegate(connectionInfo, validator, amount).then(async (resp) => {
        if (resp.isError()) {
          toast.error('Delegation of ' + amount + useConfigurationStore().config.stakingDenom  + ' to ' + validator + ' failed')
          onTxDeliveryFailure(connectionInfo, this, resp);
        } else {
          fetchBalance(connectionInfo, this);
          fetchRewards(connectionInfo, this);
          fetchDelegations(connectionInfo, this);
          // fetchUnbondingDelegations(connectionInfo, this)
        }
      })
    },
    async redelegate(validatorSrc: string, validatorDst: string, amount: string) {
      const connectionInfo = this.connectionInfo;
      await apiFactory.accountApi().redelegate(connectionInfo, validatorSrc, validatorDst, amount).then(async (resp) => {
        if (resp.isError()) {
          toast.error('Redelegation of ' + amount + useConfigurationStore().config.stakingDenom  + ' to ' + validatorDst + ' failed')
          onTxDeliveryFailure(connectionInfo, this, resp);
        } else {
          fetchBalance(connectionInfo, this);
          fetchRewards(connectionInfo, this);
          fetchDelegations(connectionInfo, this);
          // fetchUnbondingDelegations(connectionInfo, this)
        }
      })
    },
    async undelegate(validator: string, amount: string) {
      const connectionInfo = this.connectionInfo;
      await apiFactory.accountApi().undelegate(connectionInfo, validator, amount).then(async (resp) => {
        if (resp.isError()) {
          toast.error('Undelegation of ' + amount + useConfigurationStore().config.stakingDenom  + ' from ' + validator + ' failed')
          onTxDeliveryFailure(connectionInfo, this, resp);
        } else {
          fetchBalance(connectionInfo, this);
          fetchRewards(connectionInfo, this);
          fetchDelegations(connectionInfo, this);
          fetchUnbondingDelegations(connectionInfo, this);
        }
      })
    },
    async claimRewards() {
      const connectionInfo = this.connectionInfo;
      const validators = this.rewards.getAllValidatorsAddresses();
      apiFactory.accountApi().claimRewards(connectionInfo, validators).then(async (resp) => {
        if (resp.isError()) {
          toast.error('Claiming rewards failed')
          onTxDeliveryFailure(connectionInfo, this, resp);
        } else {
          fetchBalance(connectionInfo, this);
          fetchRewards(connectionInfo, this);
        }
      })
    },
    async vote(option: VoteOption, proposalId: number){
      apiFactory.accountApi().vote(this.connectionInfo, option, proposalId).then(async (resp) => {
        if (resp.isError()) {
          toast.error('Vote: ' + option + ' for proposal ' + proposalId + ' failed')
        } else {
          // TODO refresh data ??
        }
      })
    },
    async logOut(){
      toast.success('Address: "' + this.connectionInfo.account + '" Disconnected');
      clearStateOnLogout(this)
      // this._isLoggedIn = false;
      // this.connectionInfo = ConnectionInfo.disconnected,
      // this.account = Object();
      // localStorage.removeItem('account')
    },
  },
  getters: {
    getConnectionType(): ConnectionType{
      return this.connectionInfo.connectionType
    },
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
    getBalance(): number {
      return this.balance;
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
    getTotalUndelegating(): number{
      return this.undelegations.totalUndelegating;
    },
    getUndelegations(): UnbondingDelegations {
      return this.undelegations;
    },
    // getStackedList(): stackingList{
    //   return this.stackingList
    // },
    getDelegations(): Delegations {
      return this.delegations
    },
    getTotalDelegated(): number{
      return this.delegations.totalDelegated;
    },
    getVestingLockAmount() : number{
      return this.vestimgAccLocked
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: sessionStorage, paths: ['logged', 'account', 'type', 'stackingList', 'rewards'] },
    ]
  }
});

function checkIfConnected(connectionInfo: ConnectionInfo): boolean {
  if (connectionInfo.connectionType === ConnectionType.Disconnected) {
    toast.error('Not connected');
    return false;
  }
  return true;
}

function clearStateForNonexistentAccount(state: UserState) {
  state.balance = 0;
  state.vestimgAccLocked = 0;
  state.rewards = new Rewards();
  state.delegations = new Delegations();
  state.undelegations = new UnbondingDelegations();
}

function clearStateOnLogout(state: UserState) {
  state._isLoggedIn = false;
  state.connectionInfo = ConnectionInfo.disconnected;
  state.account = Object();
  clearStateForNonexistentAccount(state);
}

async function fetchBalance(connectionInfo: ConnectionInfo, state: UserState): Promise<boolean> {
  const address = connectionInfo.account;
  const denom = useConfigurationStore().config.stakingDenom
  const response = await apiFactory.accountApi().fetchBalance(address, denom)
  if (response.isSuccess() && response.data !== undefined) {
    const balance = response.data;
    state.balance = parseInt(balance.amount); // TODO use bigint recalculate with decimal
    return true;
  } else {
    return false;
  }
}

async function fetchDelegations(connectionInfo: ConnectionInfo, state: UserState): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchDelegations(address)
  if (response.isSuccess() && response.data !== undefined) {
    state.delegations = response.data
    return true;
  } else {
    return false;
  }
}

async function fetchUnbondingDelegations(connectionInfo: ConnectionInfo, state: UserState): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchUnbondingDelegations(address)
  if (response.isSuccess() && response.data !== undefined) {
    state.undelegations = response.data
    return true;
  } else {
    return false;
  }
}

async function fetchRewards(connectionInfo: ConnectionInfo, state: UserState): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchRewards(address)
  if (response.isSuccess() && response.data !== undefined) {
    state.rewards = response.data
    return true;
  } else {
    return false;
  }
}

function onTxDeliveryFailure(connectionInfo: ConnectionInfo, state: UserState, response: RequestResponse<TxData, TxBroadcastError>) {
  if (response.error?.hasTxData()) {
    fetchBalance(connectionInfo, state);
  }
}
