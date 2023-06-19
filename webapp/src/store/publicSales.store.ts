import { defineStore } from "pinia";
import {Coin} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import factoryApi from "@/api/factory.api";
import {
  BlockchainInfo,
  InitPaymentSessionRequest, MetamaskPayInfo, RESERVATION_STATUS, RoundInfo,
  TokenPaymentProofRequest,
  Transaction
} from "@/models/saleServiceCommons";
import {clearAuthTokens} from "axios-jwt";
import {LoginTypeEnum} from "@/store/userService.store";
import apiFactory from "@/api/factory.api";
export interface PublicSalesState{
  total: Coin | undefined,
  parts: parts | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  c4eToUSDC: number | undefined,
  tokenReservations: TokenReservation[] | undefined,
  blockchainInfo: BlockchainInfo[],
  roundInfo: RoundInfo | undefined
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
  orderId: number;
  amount: Coin;
  paymentType: paymentType;
  status: RESERVATION_STATUS;
  transactions: Transaction[];
  reservationEnd: Date;
  orderEndTime: Date;
  constructor(
    orderId: number,
    amount: Coin,
    paymentType: paymentType,
    status: RESERVATION_STATUS,
    transactions: Transaction[],
    reservationEnd: Date,
    orderEndTime: Date
  ) {
    this.orderId = orderId;
    this.amount = amount;
    this.paymentType = paymentType;
    this.status = status;
    this.transactions = transactions;
    this.reservationEnd = reservationEnd;
    this.orderEndTime = orderEndTime;
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
      c4eToUSDC: undefined,
      tokenReservations: undefined,
      blockchainInfo: [],
      roundInfo: undefined
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
    reserveTokens(amount: number, onSuccess: ((orderId: number) => void), onFail: (() => void), lockscreen = true) {
      return factoryApi.publicSaleServiceApi().reserveTokens(amount, lockscreen).then(res => {
        if(res.isSuccess() && res.data?.orderId) {
          onSuccess(res.data.orderId);
        } else {
          onFail();
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
    fetchRoundInfo(lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchRoundInfo(lockscreen).then(res => {
        if(res.isSuccess() && res.data) {
          this.roundInfo = res.data;
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
        console.log(res)
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
        console.log(res)
        return res;
      });
    },
    setCurrentPrice(){
      this.c4eToUSDC = 0.18;
    },
    logOutAccount(){
      this.tokenReservations = [];
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
    getC4eToUSDC(): number| undefined{
      return this.c4eToUSDC;
    },
    getStartDate(): Date | undefined{
      return this.startDate;
    },
    getEndDate(): Date | undefined{
      return this.endDate;
    },
    getTransactions(): TokenReservation[] | undefined{
      return this.tokenReservations;
    }
  }
});

function getFakeTransactionsData() {
  return [
    {
      amount: '1000000000',
      paymentType: 'Crypto',
      status: 'Declared',
      reservationEnd: "2023-05-12T20:45:20",
    },
    {
      amount: '1000000000',
      paymentType: 'StandardCurrency',
      status: 'Paid',
      txHash: 'tx-123123123123123123',
      blockChainType: 'BSC or Ethereum',
    },
    {
      amount: '1000000000',
      paymentType: 'Crypto',
      status: 'Error',
      txHash: 'tx-123123123123123123',
      blockChainType: 'BSC',
    },
  ];
}

