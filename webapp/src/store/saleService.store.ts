import { defineStore } from "pinia";
import factoryApi from "@/api/factory.api";
import {InitPaymentSessionRequest} from "@/models/saleServiceCommons";

export interface SaleServiceState{
  test: string
}

export const useSaleServiceStore = defineStore({
  id: 'saleServiceStore',
  state: (): SaleServiceState =>{
    return {
      test: ''
    };
  },
  actions: {
    reserveTokens(amount: number, lockscreen = true) {
      return factoryApi.saleServiceApi().reserveTokens(amount, lockscreen).then(res => {
        console.log(res);
      });
    },
    initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen = true) {
      return factoryApi.saleServiceApi().initPaymentSession(initPaymentSessionRequest, lockscreen).then(res => {
        console.log(res);
        return res.data?.transactionId;
      });
    }
  },
  getters: {

  }

});
