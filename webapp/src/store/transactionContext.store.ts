import {defineStore} from "pinia";
import {Currency} from "@/models/currency";


interface TransactionContextState {
  paymentCurrency?: Currency,
  amountToPay: number,
  amountToBuy: number
}


export const useTransactionContextStore = defineStore({
  id: 'transactionContextStore',
  state: (): TransactionContextState => {
    return {
      paymentCurrency: undefined,
      amountToBuy: 0,
      amountToPay: 0
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
    }
  },
  persist: {
    enabled: true
  }
});
