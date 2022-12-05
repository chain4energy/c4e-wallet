import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { StakingPool } from "@/models/store/tokens";
import { Coin, DecCoin } from "@/models/store/common";
import { useConfigurationStore } from "./configuration.store";
import { useToast } from "vue-toastification";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";
import axios from "axios";
import {AirdropStore} from "@/models/store/airdrop";
import {airDrop} from "@/models/airdrop/airdrop";
import {BigDecimal} from "@/models/store/big.decimal"


const toast = useToast();
const logger = new StoreLogger(ServiceTypeEnum.AIR_DROP_STORE);

interface airDropState {
  airDrop1: AirdropStore
  no_Drop: boolean,
}

export const useAirDropStore= defineStore({
  id: 'airDropStore',
  state: (): airDropState => {
    return {
      airDrop1: Object(AirdropStore),
      no_Drop: Boolean(false),
    };
  },
  actions: {
    async fetchAirdrop(address: string, lockscreen = true) {
      this.no_Drop = Boolean(false);
      try {
        apiFactory.airDropApi().fetchAirdropCosmos(address, true).then((res) => {
          if(res?.data){
            this.airDrop1 = new AirdropStore(
              res.data.atom_staked_balance,
              res.data.atom_address,
              res.data.c4e_address,
              res.data.base_airdrop,
              res.data.booster_1_airdrop,
              res.data.booster_2_airdrop,
              res.data.gleam_airdrop,
              new DecCoin(new BigDecimal(BigInt(res.data.total_amount)), 'uc4e'),
              res.data.voted_on_proposal,
              res.data.atom_delegated_outside,
              res.data.delegated_outside,
            );
            this.no_Drop = true;
          }

        });
      } catch (err){
        this.no_Drop = false;
      }
    }
  },
  getters: {
    getAirDropStatus() : boolean{
      return this.no_Drop;
    },
    getAirDrop(): AirdropStore{
      return this.airDrop1;
    }
  },
});
