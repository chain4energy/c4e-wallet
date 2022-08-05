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
import { string } from "yup";

const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.TOKENS_STORE);

interface TokensState {
  stakingPool: StakingPool
  totalSupply: Coin
  communityPool: DecCoin
  strategicReversePool: Coin
  airdropPool: Coin
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
      airdropPool: emptyCoin
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
    clear() {
      const denom = useConfigurationStore().config.stakingDenom;
      const emptyCoin = new Coin(0n, denom);
      this.stakingPool = new StakingPool(0n, 0n);
      this.totalSupply = emptyCoin;
      this.communityPool = new DecCoin(new BigDecimal(0), denom);
      this.strategicReversePool = emptyCoin;
      this.airdropPool = emptyCoin;
    }
  },
  getters: {
    getStakingPool(): StakingPool {
      return this.stakingPool;
    },
    getTotalUnbonded(): bigint {
      return this.getTotalSupply.amount
      - this.getStakingPool.bondedTokens
      - this.getStakingPool.notBondedTokens;
    },
    getTotalUnbondedViewAmount(): (precision?: number) => string {
      return (precision = 4) => {
        const unbonded = this.getTotalUnbonded
        return useConfigurationStore().config.getViewAmount(unbonded, precision);
      }
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
      console.log('FFFFFF: ' + amount);
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
    getBoundedPercentage(): (precision?: number) => string {
      return (precision = 2) => {
        if (this.totalSupply.amount === 0n) {
          return toPercentage(0, precision);
        }
        return toPercentage(divideBigInts(this.stakingPool.bondedTokens, this.totalSupply.amount), precision);
      }
    },
    getUnboundedPercentage(): (precision?: number) => string {
      return (precision = 2) => {
        if (this.totalSupply.amount === 0n) {
          return toPercentage(0, precision);
        }
        return toPercentage(divideBigInts(this.getTotalUnbonded, this.totalSupply.amount), precision);
      }
    },
    getUnboundingPercentage(): (precision?: number) => string {
      return (precision = 2) => {
        if (this.totalSupply.amount === 0n) {
          return toPercentage(0, precision);
        }
        return toPercentage(divideBigInts(this.stakingPool.notBondedTokens, this.totalSupply.amount), precision);
      }
    },
  }
});
