import {defineStore} from "pinia";
import {StakingPool, Pool} from "@/models/StakingPool";
import {Amount, TotalSupply} from "@/models/TotalSupply";
import apiFactory from "@/api/factory.api";
import {AirdropPool, CommunityPool, StrategicReversePool} from "@/models/Pools";
import { useValidatorsStore } from "@/store/validators.store";

interface TokensState {
  stakingPool: Pool
  totalSupply: Amount
  communityPool: Amount
  strategicReversePool: Amount
  airdropPool: Amount
}

export const useTokensStore = defineStore({
  id: 'tokensStore',
  state: (): TokensState => {
    return {
      stakingPool: Object(),
      totalSupply: Object(),
      communityPool: Object(),
      strategicReversePool: Object(),
      airdropPool: Object()
    };
  },
  actions: {
    fetchStakingPool() {
      apiFactory.tokensApi().fetchStakingPool().then(response => {
        if (response.error == null && response.data != undefined) {
          const stakingPool:StakingPool = response.data;
          this.stakingPool = stakingPool.pool;
          if(useValidatorsStore().getValidators){
            useValidatorsStore().setVotingPower(useValidatorsStore().getValidators)
          }
        } else {
          //TODO: error handling
        }
      });
    },
    fetchTotalSupply() {
      apiFactory.tokensApi().fetchTotalSupply().then(response => {
        if (response.error == null && response.data != undefined) {
          const totalSupply: TotalSupply = response.data;
          this.totalSupply = totalSupply.amount;
        } else {
          //TODO: error handling
        }
      });
    },
    fetchPools() {
      this.fetchCommunityPool();
      this.fetchStrategicReversePool();
      this.fetchAirdropPool();
    },
    fetchCommunityPool() {
      apiFactory.tokensApi().fetchCommunityPool().then(response => {
        if (response.error == null && response.data != undefined) {
          const communityPool: CommunityPool = response.data;
          this.communityPool = communityPool.pool[0];
        } else {
          //TODO: error handling
        }
      });
    },
    fetchStrategicReversePool() {
      apiFactory.tokensApi().fetchStrategicReversePool().then(response => {
        if (response.error == null && response.data != undefined) {
          const strategicReversePool: StrategicReversePool = response.data;
          this.strategicReversePool = strategicReversePool.balance;
        } else {
          //TODO: error handling
        }
      });
    },
    fetchAirdropPool() {
      apiFactory.tokensApi().fetchAirdropPool().then(response => {
        if (response.error == null && response.data != undefined) {
          const airdropPool: AirdropPool = response.data;
          this.airdropPool = airdropPool.balance;
        } else {
          //TODO: error handling
        }
      });
    }
  },
  getters: {
    getStakingPool(): Pool {
      return this.stakingPool;
    },
    getTotalSupply(): Amount {
      return this.totalSupply;
    },
    getCommunityPool(): Amount {
      return this.communityPool;
    },
    getStrategicReversePool(): Amount {
      return this.strategicReversePool;
    },
    getAirdropPool(): Amount {
      return this.airdropPool;
    }
  }
});
