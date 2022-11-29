import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { StakingPool } from "@/models/store/tokens";
import { Coin, DecCoin } from "@/models/store/common";
import { useConfigurationStore } from "./configuration.store";
import { useToast } from "vue-toastification";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";
import { BigDecimal, divideBigInts } from "@/models/store/big.decimal";
import axios from "axios";
import {Airdrop} from "@/models/store/airdrop";


const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.AIR_DROP_STORE);

interface airDropState {
  airDrop1: Airdrop
  no_Drop: boolean,
}

export const useAirDropStore= defineStore({
  id: 'airDropStore',
  state: (): airDropState => {
    return {
      airDrop1: Object(Airdrop),
      no_Drop: Boolean(),
    };
  },
  actions: {
    async fetchAirdrop(address: string, lockscreen = true) {
      this.no_Drop = Boolean(false);
      let res;
      try {
        res = await axios.get(`${process.env.VUE_APP_PROXY_AIR}${address}.json`);
      } catch (err: any) {
        this.no_Drop = true;
      } finally {
        if(!this.no_Drop && res?.data){
          const air = res.data;
          this.airDrop1 = new Airdrop(
            air.atom_staked_balance,
            air.atom_address,
            air.c4e_address,
            air.base_airdrop,
            air.booster_1_airdrop,
            air.booster_2_airdrop,
            air.gleam_airdrop,
            new DecCoin(air.total_amount, 'uc4e'),
            air.voted_on_proposal,
            air.atom_delegated_outside,
            air.delegated_outside,

          )
        }
      }
    },
  },
  getters: {
    getAirDropStatus() : boolean{
      return this.no_Drop;
    },
    getAirDrop(): Airdrop{
      return this.airDrop1;
    }
  },
});
