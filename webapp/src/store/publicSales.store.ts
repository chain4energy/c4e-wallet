import { defineStore } from "pinia";
import {Coin} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
export interface PublicSalesState{
  total: Coin | undefined,
  parts: parts | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  c4eToUSDC: number | undefined
}
export interface parts{
  solved: Coin,
  reserved: Coin,
}
export const usePublicSalesStore = defineStore({
  id: 'publicSalesStore',
  state: (): PublicSalesState =>{
    return {
      total: undefined,
      parts: undefined,
      startDate: undefined,
      endDate: undefined,
      c4eToUSDC: undefined,
    };
  },
  actions: {
    setTotal(){
      const denom = useConfigurationStore().config.stakingDenom;
      this.total = new Coin(BigInt(250000000000000), denom);
      this.startDate = new Date('2023-05-08T10:00:00')
      this.endDate = new Date('2023-05-09T22:50:00');
    },
    setParts(){
      const denom = useConfigurationStore().config.stakingDenom;
      this.parts = {
        solved: new Coin(BigInt(105000000000000), denom),
        reserved : new Coin(BigInt(45000000000000), denom)
      };
    },
    setCurrentPrice(){
      this.c4eToUSDC = 0.1;
    },
  },
  getters:{
    getTotal(): Coin | undefined{
      return this.total;
    },
    getParts(): parts | undefined{
      return this.parts;
    },
    getC4eToUSDC(): number| undefined{
      return this.c4eToUSDC;
    },
    getStartDate(): Date | undefined{
      return this.startDate;
    },
    getEndDate(): Date | undefined{
      return this.endDate;
    }
  }
});
