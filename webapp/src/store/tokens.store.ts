import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {StakingPool} from "@/models/store/tokens";
import {Coin, DecCoin} from "@/models/store/common";
import {useConfigurationStore} from "./configuration.store";
import {useToast} from "vue-toastification";
import {StoreLogger} from "@/services/logged.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {LogLevel} from "@/services/logger/log-level";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";
import {ToastsService} from "@/services/toasts/toasts.service";
import {ToastsTypeEnum} from "@/services/toasts/toasts-type.enum";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.TOKENS_STORE);

interface TokensState {
  stakingPool: StakingPool
  totalSupply: Coin
  communityPool: DecCoin
  strategicReversePool: Coin
  strategicReversePoolUnbonded: Coin,
  airdropPool: Coin
  inflation: number,
  lockedVesting: bigint,
  shareParameter: number;
}

export const useTokensStore = defineStore({
  id: 'tokensStore',
  state: (): TokensState => {
    const denom = useConfigurationStore().config.stakingDenom;
    const emptyCoin = new Coin(0n, denom);
    return {
      stakingPool: new StakingPool(0n, 0n),
      totalSupply: emptyCoin,
      communityPool: new DecCoin(new BigDecimal(0), denom),
      strategicReversePool: emptyCoin,
      strategicReversePoolUnbonded: emptyCoin,
      airdropPool: emptyCoin,
      inflation: Number.NaN,
      lockedVesting: BigInt(0),
      shareParameter: Number.NaN
    };
  },
  actions: {
    async fetchStakingPool(lockscreen = true) {
      await apiFactory.tokensApi().fetchStakingPool(lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.stakingPool = response.data;
        } else {
          const message = 'Error fetching staking pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          ToastsService.getInstance().errorToast(ToastsTypeEnum.STAKING_POOL, message);
        }
      });
    },
    async fetchTotalSupply(lockscreen = true) {
      const denom = useConfigurationStore().config.stakingDenom;
      await apiFactory.tokensApi().fetchTotalSupply(denom, lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.totalSupply = response.data;
        } else {
          const message = 'Error fetching total supply data';
          logger.logToConsole(LogLevel.ERROR, message);
          ToastsService.getInstance().errorToast(ToastsTypeEnum.TOTAL_SUPPLY, message);
        }
      });
    },
    async fetchPools(lockscreen = true) {
      await Promise.all([
        this.fetchCommunityPool(lockscreen),
        this.fetchStrategicReversePool(lockscreen),
        this.fetchAirdropPool(lockscreen),
      ]);
    },
    async fetchCommunityPool(lockscreen = true) {
      const denom = useConfigurationStore().config.stakingDenom;
      await apiFactory.tokensApi().fetchCommunityPoolByDenom(denom, lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.communityPool = response.data;
        } else {
          const message = 'Error fetching community pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          ToastsService.getInstance().errorToast(ToastsTypeEnum.COMMUNITY_POOL, message);
        }
      });
    },
    async fetchStrategicReversePool(lockscreen = true) {
      const denom = useConfigurationStore().config.stakingDenom;

      let delegations = 0n;
      let unbondingDelegations = 0n;
      let unbonded = 0n;
      const promises = Array<Promise<void>>();
      for (const address of useConfigurationStore().config.strategicPoolAddress) {
        promises.push(apiFactory.accountApi().fetchDelegations(address, lockscreen).then(response => {
            if (response.isSuccess() && response.data !== undefined) {
              delegations += response.data.totalDelegated;
            } else {
              const message = 'Error fetching strategic reverse pool data';
              logger.logToConsole(LogLevel.ERROR, message);
              ToastsService.getInstance().errorToast(ToastsTypeEnum.STRATEGIC_REVERSE_POOL, message);
            }
          }));
        promises.push( apiFactory.accountApi().fetchUnbondingDelegations(address, lockscreen).then(response => {
            if (response.isSuccess() && response.data !== undefined) {
              unbondingDelegations += response.data.totalUndelegating;
            } else {
              const message = 'Error fetching strategic reverse pool data';
              logger.logToConsole(LogLevel.ERROR, message);
              ToastsService.getInstance().errorToast(ToastsTypeEnum.STRATEGIC_REVERSE_POOL, message);
            }
          }));
        promises.push( apiFactory.accountApi().fetchBalance(address, denom, lockscreen).then(response => {
            if (response.isSuccess() && response.data !== undefined) {
              unbonded += response.data.amount;
            } else {
              const message = 'Error fetching strategic reverse pool data';
              logger.logToConsole(LogLevel.ERROR, message);
              ToastsService.getInstance().errorToast(ToastsTypeEnum.STRATEGIC_REVERSE_POOL, message);
            }
          }));
      }
      await Promise.all(promises);
      this.strategicReversePool = new Coin((delegations + unbondingDelegations + unbonded), denom );
      this.strategicReversePoolUnbonded = new Coin(unbonded, denom);
    },
    async fetchAirdropPool(lockscreen = true) {
      const denom = useConfigurationStore().config.stakingDenom;
      const address = useConfigurationStore().config.airdropPoolAddress;
      await apiFactory.accountApi().fetchBalance(address, denom, lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.airdropPool = response.data;
        } else {
          const message = 'Error fetching airdrop pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          ToastsService.getInstance().errorToast(ToastsTypeEnum.AIRDROP_POOL, message);
        }
      });
    },
    async fetchDistributorParams(lockscreen = true) {
      await apiFactory.tokensApi().fetchShareParameter(lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.shareParameter = response.data;
        } else {
          const message = 'Error fetching distributorParams data';
          logger.logToConsole(LogLevel.ERROR, message);
          ToastsService.getInstance().errorToast(ToastsTypeEnum.DISTRIBUTOR_PARAMS, message);
        }
      });
    },
    async fetchInflation(lockscreen = true) {
      await apiFactory.tokensApi().fetchInflation(lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.inflation = response.data;
        } else {
          const message = 'Error fetching inflation data';
          logger.logToConsole(LogLevel.ERROR, message);
          // toast.error(message);  // TODO uncomment when inflation on testnet
        }
      });
    },
    fetchLockedVesting: async function (lockscreen = true) {
      await apiFactory.tokensApi().fetchVestingLockedNotDelegated(lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.lockedVesting = response.data;
        } else {
          const message = 'Error fetching locked vesting';
          logger.logToConsole(LogLevel.ERROR, message);
        }
      });
    },
    clear() {
      const denom = useConfigurationStore().config.stakingDenom;
      const emptyCoin = new Coin(0n, denom);
      this.stakingPool = new StakingPool(0n, 0n);
      this.totalSupply = emptyCoin;
      this.communityPool = new DecCoin(new BigDecimal(0), denom);
      this.strategicReversePool = emptyCoin;
      this.airdropPool = emptyCoin;
      this.inflation = Number.NaN;
    }
  },
  getters: {
    getStakingPool(): StakingPool {
      return this.stakingPool;
    },
    getTotalBonded(): bigint {
      return this.getStakingPool.bondedTokens;
    },
    getTotalUnbonding(): bigint {
      return this.getStakingPool.notBondedTokens;
    },
    getTotalUnbonded(): bigint {
      return this.getTotalSupply.amount
      - this.getStakingPool.bondedTokens
      - this.getStakingPool.notBondedTokens;
    },
    getTotalSupply(): Coin {
      return this.totalSupply;
    },
    getCirculatingSupply(): DecCoin {
      const amount =  this.getTotalUnbonded
                    - this.strategicReversePoolUnbonded.amount
                    - this.getAirdropPool.amount
                    - this.getLockedVesting;
      const amountDec = new BigDecimal(amount).subtract(this.communityPool.amount);
      return new DecCoin(amountDec, this.totalSupply.denom);
    },
    getCommunityPool(): DecCoin {
      return this.communityPool;
    },
    getStrategicReversePool(): Coin {
      return this.strategicReversePool;
    },
    getAirdropPool(): Coin {
      return this.airdropPool;
    },
    getRemainingTokens(): DecCoin {
      const amount = this.totalSupply.amount
        - this.strategicReversePool.amount
        - this.airdropPool.amount;
      const amountDec = new BigDecimal(amount).subtract(this.communityPool.amount);
      return new DecCoin(amountDec, this.totalSupply.denom);
    },
    getLockedVesting(): bigint {
      return this.lockedVesting;
    },
    getAprPercentage(): BigDecimal | number {
      if (isNaN(this.inflation)) {
        return Number.NaN;
      }
      if (this.getStakingPool.bondedTokens === 0n) {
        return Number.POSITIVE_INFINITY;
      }
      return new BigDecimal(this.inflation).multiply(this.totalSupply.amount).divide(this.getStakingPool.bondedTokens).multiply(this.shareParameter);
    },
    getBoundedPercentage(): BigDecimal {
      if (this.totalSupply.amount === 0n) {
        return new BigDecimal(0);
      }
      return divideBigInts(this.stakingPool.bondedTokens, this.totalSupply.amount);
    },
    getUnboundedPercentage(): BigDecimal  {
        if (this.totalSupply.amount === 0n) {
          return new BigDecimal(0);
        }
        return divideBigInts(this.getTotalUnbonded, this.totalSupply.amount);
    },
    getUnboundingPercentage(): BigDecimal {
      if (this.totalSupply.amount === 0n) {
        return new BigDecimal(0);
      }
      return divideBigInts(this.stakingPool.notBondedTokens, this.totalSupply.amount);
    },
  }
});
