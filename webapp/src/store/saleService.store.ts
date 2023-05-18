import { defineStore } from "pinia";
import factoryApi from "@/api/factory.api";
import {InitPaymentSessionRequest, TokenReservationResponse} from "@/models/saleServiceCommons";

export interface SaleServiceState{
  test: string;
}

export const useSaleServiceStore = defineStore({
  id: 'saleServiceStore',
  state: (): SaleServiceState =>{
    return {
      test: ''
    };
  },
  actions: {
    reserveTokens(amount: number, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      return factoryApi.saleServiceApi().reserveTokens(amount, lockscreen).then(res => {
        if(res.isSuccess()) {
          onSuccess();
        } else {
          onFail();
        }
      });
    },
    initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen = true) {
      return factoryApi.saleServiceApi().initPaymentSession(initPaymentSessionRequest, lockscreen).then(res => {
        console.log(res);
        return res.data?.transactionId;
      });
    },
  },
  getters: {

  }

});
