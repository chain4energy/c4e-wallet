import {LoyaltyDropPoolConfig, UserBoost} from "@/models/store/loyaltyDrop";
import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {Coin} from "@/models/store/common";
import {string} from "yup";

interface BoostState {
  boosts: LoyaltyDropPoolConfig[]
  boostVestingAccounts: UserBoost[]
}
export const useBoostStore = defineStore({
  id: 'boostsStore',
  state: (): BoostState => {
    return {
      boosts: Array<LoyaltyDropPoolConfig>(),
      boostVestingAccounts: Array<UserBoost>()
    };
  },
  actions: {
    async fetchBoostConfig(lockscreen = true) {
      await apiFactory.boostApi().fetchLoyaltyDropPoolsConfig(lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined) {
          console.log(resp);
          this.boosts = resp.data;
        } else {
          //TODO: error handling
        }
      });
    },
    async fetchUserBoost(lockscreen = true) {
      // this.boostVestingAccounts = [
      //   new UserBoost('UserVestingPoolName1'),
      //   new UserBoost('UserVestingPoolName2'),
      //   new UserBoost('UserVestingPoolName3'),
      //   new UserBoost('UserVestingPoolName4')
      // ];
      // await apiFactory.boostApi().fetchUserBoosts(lockscreen).then((resp) => {
      //   if (resp.isSuccess() && resp.data !== undefined) {
      //     console.log(resp);
      //     this.params = resp.data;
      //   }
      // });
    },
  },
  getters: {
    getBoosts():LoyaltyDropPoolConfig[]{
      return this.boosts;
    },
    getUserBoosts():UserBoost[]{
      return this.boostVestingAccounts;
    }
  }
});
