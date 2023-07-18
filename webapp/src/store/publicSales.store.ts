import { defineStore } from "pinia";
import {Coin} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import factoryApi from "@/api/factory.api";
import {
  BlockchainInfo,
  InitPaymentSessionRequest, MetamaskPayInfo, RESERVATION_STATUS, RoundInfo, RoundInfoBlockchainInfo,
  TokenPaymentProofRequest,
  Transaction
} from "@/models/saleServiceCommons";
import apiFactory from "@/api/factory.api";
import {BigDecimal} from "@/models/store/big.decimal";
export interface PublicSalesState{
  total: Coin | undefined,
  parts: parts | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  tokenReservations: TokenReservation[] | undefined,
  blockchainInfo: BlockchainInfo[],
  roundInfo: RoundInfo | undefined,
  roundInfoMap: Map<number, RoundInfoBlockchainInfo>,
  warning: boolean
}
export interface parts{
  sold: Coin,
  reserved: Coin,
}
export enum accountSaleType{
  email,
  keplr,
}
export enum paymentType{
  updating,
  Crypto,
  StandardCurrency,
}
export enum transactionStatus{
  updating,
  Declared,
  Paid,
  Error,
}

export class TokenReservation {
  amountRequested: Coin;
  orderEndTime: Date;
  orderId: number;
  reservationEndTime: Date;
  roundId: number;
  status: RESERVATION_STATUS;
  transactions: Transaction[];
  unconfirmed: boolean;
  constructor(
    orderId: number,
    amountRequested: Coin,
    status: RESERVATION_STATUS,
    transactions: Transaction[],
    reservationEndTime: Date,
    orderEndTime: Date,
    roundId: number,
    unconfirmed: boolean
  ) {
    this.orderId = orderId;
    this.amountRequested = amountRequested;
    this.status = status;
    this.transactions = transactions;
    this.reservationEndTime = reservationEndTime;
    this.orderEndTime = orderEndTime;
    this.roundId = roundId;
    this.unconfirmed = unconfirmed;
  }
}

export const usePublicSalesStore = defineStore({
  id: 'publicSalesStore',
  state: (): PublicSalesState =>{
    return {
      total: undefined,
      parts: undefined,
      startDate: undefined,
      endDate: undefined,
      tokenReservations: undefined,
      blockchainInfo: [],
      roundInfo: undefined,
      roundInfoMap: new Map<number, RoundInfoBlockchainInfo>(),
      warning: false
    };
  },
  actions: {
    setTotal(){
      const denom = useConfigurationStore().config.stakingDenom;
      this.total = new Coin(BigInt(250000000000000), denom);
      this.startDate = new Date('2023-05-08T10:00:00');
      this.endDate = new Date('2023-05-09T22:50:00');
    },
    setParts(){
      const denom = useConfigurationStore().config.stakingDenom;
      this.parts = {
        sold: new Coin(BigInt(105000000000000), denom),
        reserved : new Coin(BigInt(45000000000000), denom)
      };
    },
    fetchTokenReservations(lockscreen = true){
      return factoryApi.publicSaleServiceApi().fetchReservationList(lockscreen).then(res => {
        if(res.isSuccess() && res.data) {
          this.tokenReservations = res.data;
        }
      });
    },
    reserveTokens(amount: number, onSuccess: ((orderId: number) => void), onFail: ((errorMessage?: string) => void), lockscreen = true) {
      return factoryApi.publicSaleServiceApi().reserveTokens(1, amount, lockscreen).then(res => {
        if(res.isSuccess() && res.data?.orderId) {
          onSuccess(res.data.orderId);
        } else {
          onFail(res.error?.data?.errorMessage);
        }
      });
    },
    initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, lockscreen = true) {
      return factoryApi.publicSaleServiceApi().initPaymentSession(initPaymentSessionRequest, lockscreen).then(res => {
        return res.data?.transactionId;
      });
    },
    fetchBlockchainInfo(lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchBlockchainInfo(lockscreen).then(res => {
        if(res.isSuccess() && res.data) {
          this.blockchainInfo = res.data;
        }
      });
    },
    fetchRoundInfo(roundId: number, lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchRoundInfo(roundId, lockscreen).then(res => {
        if(res.isSuccess() && res.data) {
          this.roundInfo = res.data.roundInfo;
          this.blockchainInfo = res.data.blockchainInfo;
        }
      });
    },
    fetchRoundInfoList(lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchRoundInfoList( lockscreen).then(res => {
        if(res.isSuccess() && res.data) {
          this.roundInfoMap = res.data.roundInfoMap;

          if(res.data.activeRoundInfo) {
            this.roundInfo = res.data.activeRoundInfo.roundInfo;
            this.blockchainInfo = res.data.activeRoundInfo.blockchainInfo;
          }

        }
      });
    },
    async provideTxPaymentProof(txPaymentProofRequest: TokenPaymentProofRequest, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().provideTxPaymentProof( txPaymentProofRequest, lockscreen).then(res => {
        if(res.isSuccess()) {
          onSuccess();
        } else {
          onFail();
        }
        console.log(res);
      });
    },
    async payByMetamask(payInfo: MetamaskPayInfo, onSuccess: (() => void), onFail: (() => void), lockscreen = true) {
      this.sendMetamaskTransaction(payInfo.amount, payInfo.blockchainAddress, payInfo.coinDecimals, payInfo.c4eAddress).then(res => {
        if (res.isSuccess() && res.data){
          this.provideTxPaymentProof({
            blockchainID: payInfo.blockchainID, exchangeID: payInfo.exchangeID, orderID: payInfo.orderId, txHashes: [res.data]
          }, onSuccess, onFail, lockscreen);
        } else {
          onFail();
        }
      });
    },
    async sendMetamaskTransaction(amount: string, blockchainAddress: string, coinDecimals: number, c4eAddress: string) {
      return await apiFactory.accountApi().sendTransaction( amount, blockchainAddress, coinDecimals, c4eAddress).then(res => {
        console.log(res);
        return res;
      });
    },
    logOutAccount(){
      this.tokenReservations = [];
    },
    toggleWarning(value: boolean){
      this.warning = value;
    }
  },
  getters:{
    getTotal(): Coin | undefined{
      return this.total;
    },
    getParts(): parts | undefined{
      if(this.roundInfo)
        return {sold: this.roundInfo.soldTokens, reserved: this.roundInfo.reservedTokens};
      return undefined;
    },
    getStartDate(): Date | undefined{
      return this.startDate;
    },
    getEndDate(): Date | undefined{
      return this.endDate;
    },
    getTransactions(): TokenReservation[] | undefined{
      return this.tokenReservations;
    },
    getC4eToUSD(): BigDecimal {
      if(this.roundInfo?.uC4eToUsd) {
        return this.roundInfo.uC4eToUsd.multiply(useConfigurationStore().config.getViewDenomConversionFactor('uc4e'));
      }
      return new BigDecimal(0);
    },
    getWarning(): boolean {
      return this.warning;
    }
  }
});

