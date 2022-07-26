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
import { BigDecimal } from "@/models/store/big.decimal";
import { useBlockStore } from "./block.store";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.USER_STORE);

export interface UserState {
  connectionInfo: ConnectionInfo
  account: Account
  balance: bigint
  vestimgAccLocked: bigint
  rewards: Rewards
  delegations: Delegations
  undelegations: UnbondingDelegations
}

const connectionInfoName = 'connectionInfo';

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => {
    return {
      [connectionInfoName]: ConnectionInfo.disconnected,
      account: Account.disconnected,
      balance: 0n,
      vestimgAccLocked: 0n,
      rewards: new Rewards(),
      delegations: new Delegations(),
      undelegations: new UnbondingDelegations(),

    };
  },
  actions: {
    async reconnect(onSuccess?: () => void){
      if(this.connectionInfo.connectionType === ConnectionType.Keplr){
        await this.connectKeplr(onSuccess);
      } else if(this.connectionInfo.connectionType === ConnectionType.Address){
        await this.connectAsAddress(this.connectionInfo.account, onSuccess);
      }
    },
    async connectKeplr(onSuccess?: () => void) {
      await this.connect(
        apiFactory.walletApi().connectKeplr(),
        () => {
          enableKeplrAccountChangeListener();
          if (onSuccess) {
            onSuccess();
          }
        }
        );
    },
    async connectAsAddress(address: string, onSuccess?: () => void) {
      // TODO address validations
      await this.connect(
        apiFactory.walletApi().connectAddress(address),
        onSuccess
      );
    },
    async connect(
      connectionResponse: Promise<RequestResponse<ConnectionInfo, ConnectionError>>,
      onSuccess?: () => void
    ) {
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
            if (onSuccess !== undefined) {
              onSuccess();
            }
            logger.logToConsole(LogLevel.DEBUG, 'Address: "' + address + '" Connected');
            toast.success('Address: "' + address + '" Connected');
          } else {
            logger.logToConsole(LogLevel.ERROR, 'Address: "' + address + '" Connection failed');
            toast.error('Address: "' + address + '" Connection failed');
          }
        }
      });
    },
    async fetchAccountData(lockscreen = true) {
      const connectionInfo = this.connectionInfo;
      if (!checkIfConnected(connectionInfo)) {
        return false;
      }

      await apiFactory.accountApi().fetchAccount(connectionInfo.account, lockscreen).then(async response => {
        if (response.isSuccess() && response.data !== undefined) {
          const account = response.data;
          if (account.type !== AccountType.Nonexistent) {
            const allResults = await Promise.all([
              fetchBalance(connectionInfo, this, lockscreen),
              fetchRewards(connectionInfo, this, lockscreen),
              fetchDelegations(connectionInfo, this, lockscreen),
              fetchUnbondingDelegations(connectionInfo, this, lockscreen),
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

    async calculateVestingLocked(latestBlTime: Date) {
      if (!this.isContinuousVestingAccount ) {
        this.vestimgAccLocked = 0n;
        return;
      }
      if (this.account.continuousVestingData !== undefined) {
        this.vestimgAccLocked = this.account.continuousVestingData.calculateVestingLocked(latestBlTime);
      } else {
        this.vestimgAccLocked = 0n;
      }
    },

    async delegate(validator: string, amount: string) {
      const connectionInfo = this.connectionInfo;
      await apiFactory.accountApi().delegate(connectionInfo, validator, amount).then(async (resp) => {
        if (resp.isError()) {
          await onTxDeliveryFailure(connectionInfo, this, resp, 'Delegation of ' + amount + useConfigurationStore().config.stakingDenom  + ' to ' + validator + ' failed');
        } else {
          const allResults = await Promise.all([
            fetchBalance(connectionInfo, this, true),
            fetchRewards(connectionInfo, this, true),
            fetchDelegations(connectionInfo, this, true),
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
            fetchBalance(connectionInfo, this, true),
            fetchRewards(connectionInfo, this, true),
            fetchDelegations(connectionInfo, this, true),
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
            fetchBalance(connectionInfo, this, true),
            fetchRewards(connectionInfo, this, true),
            fetchDelegations(connectionInfo, this, true),
            fetchUnbondingDelegations(connectionInfo, this, true),
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
            fetchBalance(connectionInfo, this, true),
            fetchRewards(connectionInfo, this, true),
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
    logOut() {
      disableKeplrAccountChangeListener();
      disconnect(this);
    },
    clearWithoutConnection() {
      disableKeplrAccountChangeListener();
    }
  },
  getters: {
    getConnectionType(): ConnectionType {
      return this.connectionInfo.connectionType;
    },
    isLoggedIn (): boolean {
       return this.account.type !== AccountType.Disconnected;
    },
    getAccount(): Account {
      return this.account;
    },
    isContinuousVestingAccount(): boolean {
      return this.account.type === AccountType.ContinuousVestingAccount
        && this.account.continuousVestingData !== undefined
        && useBlockStore().getLatestBlock.time.getTime() <= this.account.continuousVestingData?.endTime.getTime();
    },
    getAccountType(): AccountType {
      return this.account.type;
    },
    getBalance(): bigint {
      return this.balance;
    },
    getBalanceViewAmount(): (precision?: number) => string {
      return (precision = 4) => {
        const config = useConfigurationStore().config;
        return config.getViewAmount(this.balance, config.stakingDenom, precision);
      }
    },
    getTotalRewards(): BigDecimal {
      return this.rewards.totalRewards;
    },
    getTotalRewardsViewAmount(): (precision?: number) => string {
      return (precision = 4) => {
        return this.rewards.getTotalRewardsViewAmount(precision);
      }
    },
    getRewards():Rewards {
      return this.rewards;
    },
    getTotalUndelegating(): bigint {
      return this.undelegations.totalUndelegating;
    },
    getTotalUndelegatingViewAmount(): (precision?: number) => string {
      return (precision = 4) => {
        return this.undelegations.getTotalUndelegatingViewAmount(precision);
      }
    },
    getUndelegations(): UnbondingDelegations {
      return this.undelegations;
    },
    getDelegations(): Delegations {
      return this.delegations;
    },
    getTotalDelegated(): bigint {
      return this.delegations.totalDelegated;
    },
    getTotalDelegatedViewAmount(): (precision?: number) => string {
      return (precision = 4) => {
        return this.delegations.getTotalDelegatedViewAmount(precision);
      }
    },
    getVestingLockAmount() : bigint {
      return this.vestimgAccLocked;
    },
    getVestingLockViewAmount(): (precision?: number) => string {
      return (precision = 4) => {
      const config = useConfigurationStore().config;
        return config.getViewAmount(this.vestimgAccLocked, config.stakingDenom, precision);
      }
    },
    getTotal() : bigint {
      return this.undelegations.totalUndelegating + this.delegations.totalDelegated + this.balance
    },
    getTotalViewAmount(): (precision?: number) => string {
      return (precision = 4) => {
        const config = useConfigurationStore().config;
        return config.getViewAmount(this.getTotal, config.stakingDenom, precision);
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: sessionStorage, paths: [connectionInfoName] },
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
  state.balance = 0n;
  state.vestimgAccLocked = 0n;
  state.rewards = new Rewards();
  state.delegations = new Delegations();
  state.undelegations = new UnbondingDelegations();
}

function disconnect(state: UserState) {
  clearStateOnLogout(state);
  toast.success('Address: "' + state.connectionInfo.account + '" Disconnected');
}

function clearStateOnLogout(state: UserState) {
  state.connectionInfo = ConnectionInfo.disconnected;
  state.account = Account.disconnected;
  clearStateForNonexistentAccount(state);
}

async function fetchBalance(connectionInfo: ConnectionInfo, state: UserState, lockscreen: boolean): Promise<boolean> {
  const address = connectionInfo.account;
  const denom = useConfigurationStore().config.stakingDenom;
  const response = await apiFactory.accountApi().fetchBalance(address, denom, lockscreen);
  if (response.isSuccess() && response.data !== undefined) {
    const balance = response.data;
    state.balance = balance.amount;
    return true;
  } else {
    return false;
  }
}

async function fetchDelegations(connectionInfo: ConnectionInfo, state: UserState, lockscreen: boolean): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchDelegations(address, lockscreen);
  if (response.isSuccess() && response.data !== undefined) {
    state.delegations = response.data;
    return true;
  } else {
    return false;
  }
}

async function fetchUnbondingDelegations(connectionInfo: ConnectionInfo, state: UserState, lockscreen: boolean): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchUnbondingDelegations(address, lockscreen);
  if (response.isSuccess() && response.data !== undefined) {
    state.undelegations = response.data;
    return true;
  } else {
    return false;
  }
}

async function fetchRewards(connectionInfo: ConnectionInfo, state: UserState, lockscreen: boolean): Promise<boolean> {
  const address = connectionInfo.account;
  const response = await apiFactory.accountApi().fetchRewards(address, lockscreen);
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
    await fetchBalance(connectionInfo, state, false);
  }
}

function onRefreshingError(allResults: boolean[]) {
  if (!allResults.every(r => r)) {
    logger.logToConsole(LogLevel.ERROR, 'Refereshing data error');
    toast.error('Refereshing data error');
    return;
  }
}

const keplrKeyStoreChange = 'keplr_keystorechange';
const keystoreChangeListener = () => {
  disconnect(useUserStore());
  useUserStore().connect(apiFactory.walletApi().connectKeplr());
}

function enableKeplrAccountChangeListener() {
  window.addEventListener(keplrKeyStoreChange, keystoreChangeListener);
}

function disableKeplrAccountChangeListener() {
  window.removeEventListener(keplrKeyStoreChange, keystoreChangeListener);
}