import {Boost, UserBoost} from "@/models/store/boost";
import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {Coin} from "@/models/store/common";

interface BoostState {
  boosts: Boost[]
  boostVestingAccounts: UserBoost[]
}
export const useBoostStore = defineStore({
  id: 'boostsStore',
  state: (): BoostState => {
    return {
      boosts: Array<Boost>(),
      boostVestingAccounts: Array<UserBoost>()
    };
  },
  actions: {
    async fetchBoostConfig(lockscreen = true) {
      // await apiFactory.boostApi().fetchBoostConfig(lockscreen).then((resp) => {
      //   if (resp.isSuccess() && resp.data !== undefined) {
      //     console.log(resp);
      //     this.params = resp.data;
      //   }
      // });
      this.boosts = [
        new Boost(
        'Boost Name 1',
          new Coin(BigInt(1000000), 'uc4e'),
          new Coin(BigInt(500000), 'uc4e'),
          new Coin(BigInt(10000), 'uc4e'),
          75,
          360),
        new Boost(
          'Boost Name 2',
          new Coin(BigInt(1000000), 'uc4e'),
          new Coin(BigInt(500000), 'uc4e'),
          new Coin(BigInt(10000), 'uc4e'),
          60,
          270),
        new Boost(
          'Boost Name 3',
          new Coin(BigInt(1000000), 'uc4e'),
          new Coin(BigInt(500000), 'uc4e'),
          new Coin(BigInt(10000), 'uc4e'),
          45,
          180)
    ];
    },
    async fetchUserBoost(lockscreen = true) {
      this.boostVestingAccounts = [
        new UserBoost('UserVestingPoolName1'),
        new UserBoost('UserVestingPoolName2'),
        new UserBoost('UserVestingPoolName3'),
        new UserBoost('UserVestingPoolName4')
      ];
      // await apiFactory.boostApi().fetchUserBoosts(lockscreen).then((resp) => {
      //   if (resp.isSuccess() && resp.data !== undefined) {
      //     console.log(resp);
      //     this.params = resp.data;
      //   }
      // });
    },
  },
  getters: {
    getBoosts():Boost[]{
      return this.boosts;
    },
    getUserBoosts():UserBoost[]{
      return this.boostVestingAccounts;
    }
  }
});
