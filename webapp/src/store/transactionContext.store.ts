import {defineStore} from "pinia";
import {Currency} from "@/models/currency";
import {KycTierEnum} from "@/models/user/kyc";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {useConfigurationStore} from "@/store/configuration.store";
import {BigDecimal} from "@/models/store/big.decimal";
import {DecCoin} from "@/models/store/common";


interface TransactionContextState {
  paymentCurrency?: Currency,
  amountToPay: DecCoin,
  amountToBuy: DecCoin,
  orderId: number,
  exchangeRate: BigDecimal,
  orderModalVisible: boolean
}
(BigInt.prototype as any).toJSON = function () {
  return '!@#'+this.toString();
};
// const reviver = (key: any, value: any) => (key === "big" ? BigInt(value) : value);

export const useTransactionContextStore = defineStore({
  id: 'transactionContextStore',
  state: (): TransactionContextState => {

    return {
      paymentCurrency: undefined,
      amountToBuy: new DecCoin(new BigDecimal(0), ''),
      amountToPay: new DecCoin(new BigDecimal(0), ''),
      orderId: 0,
      exchangeRate: new BigDecimal(0),
      orderModalVisible: false
    };
  },
  actions: {
    setAmountToPay(amount: DecCoin) {
      this.amountToPay = amount;
    },
    setAmountToBuy(amount: DecCoin) {
      this.amountToBuy = amount;
    },
    setPaymentCurrency(currency: Currency) {
      this.paymentCurrency = currency;
    },
    setOrderId(id: number) {
      this.orderId = id;
    },
    setExchangeRate(rate: BigDecimal) {
      this.exchangeRate = rate;
    }

  },
  getters: {
    getPaymentCurrency(): Currency | undefined {
      return this.paymentCurrency;
    },
    getAmountToPay(): DecCoin {
      return this.amountToPay;
    },
    getAmountToBuy(): DecCoin {
      return this.amountToBuy;
    },
    getRequiredKycLevel(): KycTierEnum {
      console.log(usePublicSalesStore().getC4eToUSD);
      console.log(this.amountToBuy.amount)
      if(usePublicSalesStore().getC4eToUSD.multiply(this.amountToBuy.amount).isBiggerThanOrEqualTo(10000)) {
        return KycTierEnum.TIER_3;
      } else if(usePublicSalesStore().getC4eToUSD.multiply(this.amountToBuy.amount).isBiggerThanOrEqualTo(1000)) {
        return KycTierEnum.TIER_2;
      } else if(usePublicSalesStore().getC4eToUSD.multiply(this.amountToBuy.amount).isBiggerThanOrEqualTo(100)) {
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
      return Number(this.amountToBuy.amount) * useConfigurationStore().config.getViewDenomConversionFactor('uc4e');
    }
  },
  persist: {
    enabled: true
  }
});
