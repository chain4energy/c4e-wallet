import {LoyaltyDropPoolConfig, LoyaltyDropUserBoost} from "@/models/store/loyaltyDrop";
import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {Validator} from "@/models/store/validator";

interface BoostState {
  loyaltyDropPoolConfigs: LoyaltyDropPoolConfig[]
  loyaltyDropUserBoosts: LoyaltyDropUserBoost[]
}
export const useLoyaltyDropStore = defineStore({
  id: 'boostsStore',
  state: (): BoostState => {
    return {
      loyaltyDropPoolConfigs: Array<LoyaltyDropPoolConfig>(),
      loyaltyDropUserBoosts: Array<LoyaltyDropUserBoost>()
    };
  },
  actions: {
    async fetchLoyaltyDropPoolsConfig(lockscreen = true) {
      await apiFactory.boostApi().fetchLoyaltyDropPoolsConfig(lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined) {
          console.log(resp);
          this.loyaltyDropPoolConfigs = resp.data;
        } else {
          //TODO: error handling
        }
      });
    },
    async fetchLoyaltyDropUserBoost(address: string, lockscreen = true) {
      await apiFactory.boostApi().fetchLoyaltyDropUserBoosts(address, lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined) {
          console.log("fetchLoyaltyDropUserBoost:" + resp);
          this.loyaltyDropUserBoosts = resp.data;
        } else {
          console.log("fetchLoyaltyDropUserBoost: ERRROR " + resp.error?.message);
          //TODO: error handling
        }
      });
    },

    async fetchSignedMessage( signedMassage: string, lockscreen = true) {
      console.log("fetchSignedMessage");
      await apiFactory.boostApi().broadcastSignedMassageToLoyaltyDropService(signedMassage, lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined) {
          console.log(resp);
          this.loyaltyDropUserBoosts.push(resp.data);
        } else {
          //TODO: error handling
        }
      });
    },
    clear(clearDropPoolConfigs = true) {
      if(clearDropPoolConfigs) {
        this.loyaltyDropPoolConfigs = Array<LoyaltyDropPoolConfig>();
      }
      this.loyaltyDropUserBoosts = Array<LoyaltyDropUserBoost>();
    }
  },
  getters: {
    getBoosts():LoyaltyDropPoolConfig[]{
      return this.loyaltyDropPoolConfigs;
    },
    getUserBoosts():LoyaltyDropUserBoost[]{
      return this.loyaltyDropUserBoosts;
    },
    getUserBoostsByPollId: (state) => (poolId: number) => {
      return state.loyaltyDropUserBoosts;//.find(boost => boost.boostPoolId === poolId);
    }
  }
});
