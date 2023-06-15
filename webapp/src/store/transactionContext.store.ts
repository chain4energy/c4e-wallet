import {defineStore} from "pinia";
import {Currency} from "@/models/currency";
import {KycTierEnum} from "@/models/user/kyc";


interface TransactionContextState {
  paymentCurrency?: Currency,
  amountToPay: number,
  amountToBuy: number,
  orderId: number,
  exchangeRate: number
}


export const useTransactionContextStore = defineStore({
  id: 'transactionContextStore',
  state: (): TransactionContextState => {
    return {
      paymentCurrency: undefined,
      amountToBuy: 0,
      amountToPay: 0,
      orderId: 0,
      exchangeRate: 0
    };
  },
  actions: {
    setAmountToPay(amount: number) {
      this.amountToPay = amount;
    },
    setAmountToBuy(amount: number) {
      this.amountToBuy = amount;
    },
    setPaymentCurrency(currency: Currency) {
      this.paymentCurrency = currency;
    },
    setOrderId(id: number) {
      this.orderId = id;
    },
    setExchangeRate(rate: number) {
      this.exchangeRate = rate;
    }

  },
  getters: {
    getPaymentCurrency(): Currency | undefined {
      return this.paymentCurrency;
    },
    getAmountToPay(): number {
      return this.amountToPay;
    },
    getAmountToBuy(): number {
      return this.amountToBuy;
    },
    getRequiredKycLevel(): KycTierEnum {
      if(this.amountToBuy > 10000) {
        return KycTierEnum.TIER_3;
      } else if(this.amountToBuy > 1000) {
        return KycTierEnum.TIER_2;
      } else if(this.amountToBuy > 100) {
        return KycTierEnum.TIER_1;
      }
      return KycTierEnum.TIER_0;
    }
  },
  persist: {
    enabled: true
  }
});
