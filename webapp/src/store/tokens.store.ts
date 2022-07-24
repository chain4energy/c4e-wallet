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
      // communityPool: Object(),
      strategicReversePool: emptyCoin,
      airdropPool: emptyCoin
    };
  },
  actions: {
    async fetchStakingPool() {
      await apiFactory.tokensApi().fetchStakingPool().then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.stakingPool = response.data;
        } else {
          const message = 'Error fetching staking pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },
    async fetchTotalSupply() {
      const denom = useConfigurationStore().config.stakingDenom;
      await apiFactory.tokensApi().fetchTotalSupply(denom).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.totalSupply = response.data;
        } else {
          const message = 'Error fetching total supply data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },
    fetchPools() {
      this.fetchCommunityPool();
      this.fetchStrategicReversePool();
      this.fetchAirdropPool();
    },
    async fetchCommunityPool() {
      const denom = useConfigurationStore().config.stakingDenom;
      await apiFactory.tokensApi().fetchCommunityPoolByDenom(denom).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.communityPool = response.data;
        } else {
          const message = 'Error fetching community pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },
    async fetchStrategicReversePool() {
      const denom = useConfigurationStore().config.stakingDenom;
      const address = useConfigurationStore().config.strategicPoolAddress;
      await apiFactory.accountApi().fetchBalance(address, denom).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.strategicReversePool = response.data;
        } else {
          const message = 'Error fetching strategic reverse pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });
    },
    async fetchAirdropPool() {
      const denom = useConfigurationStore().config.stakingDenom;
      const address = useConfigurationStore().config.airdropPoolAddress;
      await apiFactory.accountApi().fetchBalance(address, denom).then(response => {
        if (response.isSuccess() && response.data !== undefined) {
          this.airdropPool = response.data;
        } else {
          const message = 'Error fetching airdrop pool data';
          logger.logToConsole(LogLevel.ERROR, message);
          toast.error(message);
        }
      });

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
    getTotalUnbondedViewAmount(): string {
      const unbonded = this.getTotalUnbonded
      return useConfigurationStore().config.getViewAmount(unbonded);
    },
    getTotalSupply(): Coin {
      return this.totalSupply;
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
    getBoundedPercentage(): string {
      if (this.totalSupply.amount === 0n) {
        return toPercentage(0, 2);
      }
      return divideBigInts(this.stakingPool.bondedTokens, this.totalSupply.amount).multiply(100).toFixed(2);
    },
    getUnboundedPercentage(): string {
      if (this.totalSupply.amount === 0n) {
        return toPercentage(0, 2);
      }
      return divideBigInts(this.getTotalUnbonded, this.totalSupply.amount).multiply(100).toFixed(2);
    },
    getUnboundingPercentage(): string {
      if (this.totalSupply.amount === 0n) {
        return toPercentage(0, 2);
      }
      return divideBigInts(this.stakingPool.notBondedTokens, this.totalSupply.amount).multiply(100).toFixed(2);
    },
  }
});
