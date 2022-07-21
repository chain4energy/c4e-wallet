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
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from '@/services/logger/log-level';

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.USER_STORE);

export interface UserState {
  connectionInfo: ConnectionInfo
  account: Account
  balance: number
  vestimgAccLocked: number
  rewards: Rewards
  // _isLoggedIn: boolean
  delegations: Delegations
  undelegations: UnbondingDelegations
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => {
    return {
      connectionInfo: ConnectionInfo.disconnected,
      account: Account.disconnected,
      balance: 0,
      vestimgAccLocked: 0,
      rewards: new Rewards(),
      // _isLoggedIn: false,
      delegations: new Delegations(),
      undelegations: new UnbondingDelegations(),

    };
  },
  actions: {
    async reconectAcc(){
      if(this.connectionInfo.connectionType === ConnectionType.Keplr){
        await this.connectKeplr();
      } else if(this.connectionInfo.connectionType === ConnectionType.Address){
        await this.connectAsAddress(this.connectionInfo.account);
      }
    },
    async connectKeplr() {
      await this.connect(apiFactory.walletApi().connectKeplr());
    },
    async connectAsAddress(address: string) {
      // TODO address validations
      await this.connect(apiFactory.walletApi().connectAddress(address));
    },
    async connect(connectionResponse: Promise<RequestResponse<ConnectionInfo, ConnectionError>>) {
      await connectionResponse.then(async (response) => {
        if (response.isError() || response.data === undefined) {
          logger.logToConsole(LogLevel.ERROR, 'Connection failed');
          toast.error('Connection failed');
          clearStateOnLogout(this);
        } else {
          this.connectionInfo = response.data;
          const address = this.connectionInfo.account;
          await this.fetchAccountData();
          if (this.isLoggedIn) {
            logger.logToConsole(LogLevel.DEBUG, 'Address: "' + address + '" Connected');
            toast.success('Address: "' + address + '" Connected');
          } else {
            logger.logToConsole(LogLevel.ERROR, 'Address: "' + address + '" Connection failed');
            toast.error('Address: "' + address + '" Connection failed');
          }
        }
      });
    },
    async fetchAccountData() {
      const connectionInfo = this.connectionInfo;
      if (!checkIfConnected(connectionInfo)) {
        return false;
      }

      await apiFactory.accountApi().fetchAccount(connectionInfo.account).then(async response => {
        if (response.isSuccess() && response.data !== undefined) {
          const account = response.data;
          if (account.type !== AccountType.Nonexistent) {
            const allResults = await Promise.all([
              fetchBalance(connectionInfo, this),
              fetchRewards(connectionInfo, this),
              fetchDelegations(connectionInfo, this),
              fetchUnbondingDelegations(connectionInfo, this),
            ]);
            if (!allResults.every(r => r)) {
              clearStateOnLogout(this);
              return;
            }
          } else {
            clearStateForNonexistentAccount(this);
          }
          this.account = account;
        } else {
          clearStateOnLogout(this);
        }
      });
    },

    async calculateVestingLocked(latestBlTime: string){ // TODO number to BigInt
      if (!this.isContinuousVestingAccount ) {
        this.vestimgAccLocked = 0;
        return;
      }
      if (this.account.continuousVestingData !== undefined) {
        this.vestimgAccLocked = this.account.continuousVestingData.calculateVestingLocked(latestBlTime);
      } else {
        this.vestimgAccLocked = 0;
        // TODO some error toast maybe
      }
    },

    async delegate(validator: string, amount: string) {
      const connectionInfo = this.connectionInfo;
      await apiFactory.accountApi().delegate(connectionInfo, validator, amount).then(async (resp) => {
        if (resp.isError()) {
          await onTxDeliveryFailure(connectionInfo, this, resp, 'Delegation of ' + amount + useConfigurationStore().config.stakingDenom  + ' to ' + validator + ' failed');
        } else {
          const allResults = await Promise.all([
            fetchBalance(connectionInfo, this),
            fetchRewards(connectionInfo, this),
            fetchDelegations(connectionInfo, this),
          ]);
          onRefreshingError(allResults);
        }
      });
    },
    async redelegate(validatorSrc: string, validatorDst: string, amount: string) {
      const connectionInfo = this.connectionInfo;
      await apiFactory.accountApi().redelegate(connectionInfo, validatorSrc, validatorDst, amount).then(async (resp) => {
        if (resp.isError()) {
          await onTxDeliveryFailure(connectionInfo, this, resp, 'Redelegation of ' + amount + useConfigurationStore().config.stakingDenom  + ' to ' + validatorDst + ' failed');
        } else {
          const allResults = await Promise.all([
            fetchBalance(connectionInfo, this),
            fetchRewards(connectionInfo, this),
            fetchDelegations(connectionInfo, this),
          ]);
          onRefreshingError(allResults);
        }
      });
    },
    async undelegate(validator: string, amount: string) {
      const connectionInfo = this.connectionInfo;
      await apiFactory.accountApi().undelegate(connectionInfo, validator, amount).then(async (resp) => {
        if (resp.isError()) {
          await onTxDeliveryFailure(connectionInfo, this, resp, 'Undelegation of ' + amount + useConfigurationStore().config.stakingDenom  + ' from ' + validator + ' failed');
        } else {
          const allResults = await Promise.all([
            fetchBalance(connectionInfo, this),
            fetchRewards(connectionInfo, this),
            fetchDelegations(connectionInfo, this),
            fetchUnbondingDelegations(connectionInfo, this),
          ]);
          onRefreshingError(allResults);
        }
      });
    },
    async claimRewards() {
      const connectionInfo = this.connectionInfo;
      const validators = this.rewards.getAllValidatorsAddresses();
      await apiFactory.accountApi().claimRewards(connectionInfo, validators).then(async (resp) => {
        if (resp.isError()) {
          await onTxDeliveryFailure(connectionInfo, this, resp, 'Claiming rewards failed');
        } else {
          const allResults = await Promise.all([
            fetchBalance(connectionInfo, this),
            fetchRewards(connectionInfo, this),
          ]);
          onRefreshingError(allResults);
        }
      });
    },
    async vote(option: VoteOption, proposalId: number){
      const connectionInfo = this.connectionInfo;
      apiFactory.accountApi().vote(this.connectionInfo, option, proposalId).then(async (resp) => {
        if (resp.isError()) {
          await onTxDeliveryFailure(connectionInfo, this, resp, 'Vote: ' + option + ' for proposal ' + proposalId + ' failed');
        } else {
          // TODO refresh data ??
        }
      });
    },
    async logOut(){
      toast.success('Address: "' + this.connectionInfo.account + '" Disconnected');
      clearStateOnLogout(this);
    },
  },
  getters: {
    getConnectionType(): ConnectionType{
      return this.connectionInfo.connectionType;
    },
    isLoggedIn (): boolean {
       return this.account.type !== AccountType.Disconnected;
    },
    getAccount(): Account {
      return this.account;
    },
    isContinuousVestingAccount(): boolean {
      return this.account.type === AccountType.ContinuousVestingAccount;
    },
    getAccountType(): AccountType {
      return this.account.type;
    },
    getBalance(): number {
      return this.balance;
    },
    getTotalRewards(): number {
      return this.rewards.totalRewards;
    },
    getRewards():Rewards {
      return this.rewards;
    },
    getTotalUndelegating(): number{
      return this.undelegations.totalUndelegating;
    },
    getUndelegations(): UnbondingDelegations {
      return this.undelegations;
    },
    getDelegations(): Delegations {
      return this.delegations;
    },
    getTotalDelegated(): number{
      return this.delegations.totalDelegated;
    },
    getVestingLockAmount() : number{
      return this.vestimgAccLocked;
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
  state.connectionInfo = ConnectionInfo.disconnected;
  state.account = Account.disconnected;
  clearStateForNonexistentAccount(state);
}

async function fetchBalance(connectionInfo: ConnectionInfo, state: UserState): Promise<boolean> {
  const address = connectionInfo.account;
  const denom = useConfigurationStore().config.stakingDenom;
  const response = await apiFactory.accountApi().fetchBalance(address, denom);
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
  const response = await apiFactory.accountApi().fetchDelegations(address);
  if (response.isSuccess() && response.data !== undefined) {
    state.delegations = response.data;
    return true;
  } else {
    return false;
  }
}

async function fetchUnbondingDelegations(connectionInfo: ConnectionInfo, state: UserState): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchUnbondingDelegations(address);
  if (response.isSuccess() && response.data !== undefined) {
    state.undelegations = response.data;
    return true;
  } else {
    return false;
  }
}

async function fetchRewards(connectionInfo: ConnectionInfo, state: UserState): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchRewards(address);
  if (response.isSuccess() && response.data !== undefined) {
    state.rewards = response.data;
    return true;
  } else {
    return false;
  }
}

async function onTxDeliveryFailure(connectionInfo: ConnectionInfo, state: UserState, response: RequestResponse<TxData, TxBroadcastError>, message: string) {
  logger.logToConsole(LogLevel.ERROR, message);
  toast.error(message);
  if (response.error?.hasTxData()) {
    await fetchBalance(connectionInfo, state);
  }
}

function onRefreshingError(allResults: boolean[]) {
  if (!allResults.every(r => r)) {
    logger.logToConsole(LogLevel.ERROR, 'Refereshing data error');
    toast.error('Refereshing data error');
    return;
  }
}