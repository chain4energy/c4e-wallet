import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { StakingPool } from "@/models/store/tokens";
import { Coin, DecCoin, toPercentage } from "@/models/store/common";
import { useConfigurationStore } from "./configuration.store";
import { useToast } from "vue-toastification";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";
import { BigDecimal, divideBigInts } from "@/models/store/big.decimal";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.TOKENS_STORE);

interface TokensState {
  stakingPool: StakingPool
  totalSupply: Coin
  communityPool: DecCoin
  strategicReversePool: Coin
  airdropPool: Coin
  inflation: number
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
      airdropPool: emptyCoin,
      inflation: Number.NaN
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
          toast.error(message);
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
          toast.error(message);
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
          toast.error(message);
        }
      });
    },
    async fetchStrategicReversePool(lockscreen = true) {
      const denom = useConfigurationStore().config.stakingDenom;
      const address = useConfigurationStore().config.strategicPoolAddress;
      await apiFactory.accountApi().fetchBalance(address, denom, lockscreen).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.strategicReversePool = response.data;
        } else {
          const message = 'Error fetching strategic reverse pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
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
          toast.error(message);
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
    clear() {
      const denom = useConfigurationStore().config.stakingDenom;
      const emptyCoin = new Coin(0n, denom);
      this.stakingPool = new StakingPool(0n, 0n);
      this.totalSupply = emptyCoin;
      this.communityPool = new DecCoin(new BigDecimal(0), denom);
      this.strategicReversePool = emptyCoin;
      this.airdropPool = emptyCoin;
      this.inflation = Number.NaN
    }
  },
  getters: {
    getStakingPool(): StakingPool {
      return this.stakingPool;
    },
    getTotalBonded(): bigint {
      return this.getStakingPool.bondedTokens
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
      const amount = this.totalSupply.amount
                    - this.strategicReversePool.amount
                    - this.airdropPool.amount
                    - this.getStakingPool.bondedTokens
                    - this.getStakingPool.notBondedTokens;
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
    getAprPercentage(): BigDecimal | number {
      if (isNaN(this.inflation)) {
        return Number.NaN;
      }
      if (this.getStakingPool.bondedTokens === 0n) {
        return Number.POSITIVE_INFINITY;
      }
      return new BigDecimal(this.inflation).multiply(this.totalSupply.amount).divide(this.getStakingPool.bondedTokens);
    },
    getBoundedPercentage(): BigDecimal {
      if (this.totalSupply.amount === 0n) {
        return new BigDecimal(0);
      }
      return divideBigInts(this.stakingPool.bondedTokens, this.totalSupply.amount)
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
