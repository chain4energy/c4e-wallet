import {defineStore} from "pinia";
import { Pool } from "@/models/pool"

export const usePoolsStore = defineStore({
  id: 'poolsStore',
  state: () => {
    return {
      communityPool: Object(Pool),
      strategicReversePool: Object(Pool),
      airdropPool: Object(Pool)
    };
  },
  actions: {
    setCommunityPool(communityPool:  Pool) {
      this.communityPool=communityPool;
    },
    setStrategicReversePool(strategicReversePool : Pool){
      this.strategicReversePool = strategicReversePool;
    },
    setAirdropPool(airdropPool:  Pool) {
      this.airdropPool=airdropPool;
    },
  },
  getters: {

    getCommunityPool (): Pool {
      return this.communityPool;
    },
    getStrategicReversePool (): Pool {
      return this.strategicReversePool;
    },
    getAirdropPool (): Pool {
      return this.airdropPool;
    }
  }
});
