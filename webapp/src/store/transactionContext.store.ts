import {defineStore} from "pinia";
import {Currency} from "@/models/currency";
import {KycTierEnum} from "@/models/user/kyc";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {useConfigurationStore} from "@/store/configuration.store";


interface TransactionContextState {
  paymentCurrency?: Currency,
  amountToPay: number,
  amountToBuy: number,
  orderId: number,
  exchangeRate: number,
  orderModalVisible: boolean
}


export const useTransactionContextStore = defineStore({
  id: 'transactionContextStore',
  state: (): TransactionContextState => {
    return {
      paymentCurrency: undefined,
      amountToBuy: 0,
      amountToPay: 0,
      orderId: 0,
      exchangeRate: 0,
      orderModalVisible: false
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
      if(this.amountToBuy * usePublicSalesStore().getC4eToUSD > 10000) {
        return KycTierEnum.TIER_3;
      } else if(this.amountToBuy * usePublicSalesStore().getC4eToUSD > 1000) {
        return KycTierEnum.TIER_2;
      } else if(this.amountToBuy * usePublicSalesStore().getC4eToUSD > 100) {
        return KycTierEnum.TIER_1;
      }
      return KycTierEnum.TIER_0;
    },
    getRequiredKycTierId(): number | undefined {
      switch (this.getRequiredKycLevel) {
        case KycTierEnum.TIER_1:
          return 8270;
        case KycTierEnum.TIER_2:
          return 3286;
      }
      return undefined;
    },
    getAmountToBuyUc4e(): number {
      return this.amountToBuy * useConfigurationStore().config.getViewDenomConversionFactor('uc4e');
    }
  },
  persist: {
    enabled: true
  }
});
