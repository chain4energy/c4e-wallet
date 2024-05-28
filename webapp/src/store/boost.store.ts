import {LoyaltyDropPoolConfig, LoyaltyDropUserBoost} from "@/models/store/loyaltyDrop";
import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {Validator} from "@/models/store/validator";
import {useToast} from "vue-toastification";

const toast = useToast();

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
        if (resp.isSuccess()) {
          console.log(resp);
          if(resp.data) {
            this.loyaltyDropPoolConfigs = resp.data;
          } else {
            this.loyaltyDropPoolConfigs.splice(0);
          }
        } else {
          console.log("fetchLoyaltyDropPoolsConfig: ERROR " + resp.error?.message);
          toast.error('Error fetching loyalty drop data');
        }
      });
    },
    async fetchLoyaltyDropUserBoost(address: string, lockscreen = true) {
      await apiFactory.boostApi().fetchLoyaltyDropUserBoosts(address, lockscreen).then((resp) => {
        if (resp.isSuccess()) {
          console.log("fetchLoyaltyDropUserBoost:" + resp);
          if(resp.data) {
            this.loyaltyDropUserBoosts = resp.data;
          } else {
            this.loyaltyDropUserBoosts.splice(0);
          }
        } else {
          console.log("fetchLoyaltyDropUserBoost: ERROR " + resp.error?.message);
          toast.error('Error fetching loyalty drop user data');
        }
      });
    },

    async broadcastSignedMessage(signedMassage: string, lockscreen = true) {
      console.log("broadcastSignedMessage");
      return await apiFactory.boostApi().broadcastSignedMassageToLoyaltyDropService(signedMassage, lockscreen).then((resp) => {
        if (resp.isSuccess() && resp.data !== undefined) {
          console.log(resp);
          this.loyaltyDropUserBoosts.push(resp.data);
        } else {
          console.log("broadcastSignedMessage: ERROR " + resp.error?.message);
          toast.error('Error broadcasting signed message');
        }
        return resp;
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
