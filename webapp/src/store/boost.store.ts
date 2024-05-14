import {BoostConfig, UserBoost} from "@/models/store/boostConfig";
import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {Coin} from "@/models/store/common";
import {string} from "yup";

interface BoostState {
  boosts: BoostConfig[]
  boostVestingAccounts: UserBoost[]
}
export const useBoostStore = defineStore({
  id: 'boostsStore',
  state: (): BoostState => {
    return {
      boosts: Array<BoostConfig>(),
      boostVestingAccounts: Array<UserBoost>()
    };
  },
  actions: {
    async fetchBoostConfig(lockscreen = true) {
      await apiFactory.boostApi().fetchBoostConfig(lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined) {
          console.log(resp);
          this.boosts = resp.data;
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
    getBoosts():BoostConfig[]{
      return this.boosts;
    },
    getUserBoosts():UserBoost[]{
      return this.boostVestingAccounts;
    }
  }
});
