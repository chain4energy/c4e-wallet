import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import { DecCoin} from "@/models/store/common";
import {AirdropStore, AirdropTotal, AlocationsSt, Campain} from "@/models/store/airdrop";
import {ClaimRecord} from "@/models/airdrop/airdrop";
import {BigDecimal} from "@/models/store/big.decimal";

interface airDropState {
  airDrop1: AirdropStore
  no_Drop: boolean,

  claimRecord: ClaimRecord,
  airDropMock: AirdropTotal,
}

export const useAirDropStore = defineStore({
  id: 'airDropStore',
  state: (): airDropState => {
    return {
      airDrop1: Object(AirdropStore),
      no_Drop: Boolean(false),
      claimRecord: {} as ClaimRecord,
      airDropMock: Object(AirdropTotal),
    };
  },
  actions: {
    async fetchAirdrop(address: string, lockscreen = true) {
      this.no_Drop = Boolean(false);
      try {
        apiFactory.airDropApi().fetchAirdropCosmos(address, lockscreen).then((res) => {
          if (res?.data) {
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
      } catch (err) {
        this.no_Drop = false;
      }
    },
    async fetchAirdropClaimRecord(address: string, lockscreen = true) {
      try {
        apiFactory.airDropApi().fetchAirdropClaimRecord(address, lockscreen).then((resp) => {
          if (resp.data) {
            this.claimRecord = resp.data;
          }
        });
      } catch (err) {
        //console.error(err);
      }
    },
    async fetchAirdropTotal(address: string, lockscreen = true) {
      try {
        apiFactory.airDropApi().fetchAirdropMockData(address, lockscreen).then((resp) => {
          if (resp.data) {
            this.airDropMock = Object(AirdropTotal);
            const campainsList =Array<Campain>();
            resp.data.campaigns.forEach((element) =>{
              const campains = Array<AlocationsSt>();
              element.alocations.forEach((el) => {
                campains.push(new AlocationsSt(el.name, el.value));
              });
              campainsList.push(new Campain(element.name, element.details_url, campains));
            });
            this.airDropMock = new AirdropTotal(campainsList);
          }
        });
      } catch (err) {
        //console.error(err);
      }
    }
  },
  getters: {
    getAirDropStatus(): boolean {
      return this.no_Drop;
    },
    getAirDrop(): AirdropStore {
      return this.airDrop1;
    },
    getAirdropClaimRecord() : ClaimRecord{
      return this.claimRecord;
    },
    getAirDropTotal(): AirdropTotal{
      return this.airDropMock;
    }
  },
});
