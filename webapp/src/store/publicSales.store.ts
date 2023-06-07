import { defineStore } from "pinia";
import {Coin} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import factoryApi from "@/api/factory.api";
import {
  BlockchainInfo,
  InitPaymentSessionRequest, MetamaskPayInfo,
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
  blockchainInfo: BlockchainInfo[]
}
export interface parts{
  solved: Coin,
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
  status: transactionStatus;
  transactions: Transaction[];
  reservationEnd?: Date;
  constructor(
    orderId: number,
    amount: Coin,
    paymentType: paymentType,
    status: transactionStatus,
    transactions: Transaction[],
    reservationEnd? : Date,
  ) {
    this.orderId = orderId;
    this.amount = amount;
    this.paymentType = paymentType;
    this.status = status;
    this.transactions = transactions;
    this.reservationEnd = reservationEnd;
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
      blockchainInfo: []
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
    fetchTokenReservations(lockscreen = true){
      return factoryApi.publicSaleServiceApi().fetchReservationList(lockscreen).then(res => {
        if(res.isSuccess() && res.data) {
          const denom = useConfigurationStore().config.tokenReservationDenom;
          const transactions = Array<TokenReservation>();
          res.data.forEach((el)=>{
            const amountRequested = el.amountRequested ? el.amountRequested : 0;
            const amount = new Coin(BigInt(amountRequested), denom);
            const curPaymentType = paymentType.Crypto;
            let curStatus = transactionStatus.updating;
            // switch (el.paymentType){
            //   case 'Crypto': curPaymentType = paymentType.Crypto;
            //     break;
            //   case 'StandardCurrency': curPaymentType = paymentType.StandardCurrency;
            //     break;
            // }
            switch (el.status) {
              case 'DECLARED': curStatus = transactionStatus.Declared;
                break;
              case 'PAID': curStatus = transactionStatus.Paid;
                break;
              case 'ERROR': curStatus = transactionStatus.Error;
                break;
            }
            let transaction;
            if(el.reservationEndTime){
              transaction = new TokenReservation(el.orderId, amount, curPaymentType, curStatus, el.transactions, new Date(el.reservationEndTime));
            } else {
              transaction = new TokenReservation(el.orderId, amount, curPaymentType, curStatus, el.transactions);
            }

            transactions.push(transaction);
          });
          this.tokenReservations = transactions;
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
        console.log(res);
        return res.data?.transactionId;
      });
    },
    fetchBlockchainInfo(lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchBlockchainInfo(lockscreen).then(res => {
        if(res.isSuccess() && res.data) {
          this.blockchainInfo = res.data;
        }

        console.log(res);
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
      this.sendMetamaskTransaction(payInfo.amount, payInfo.blockchainAddress, payInfo.coinDecimals).then(res => {
        if (res.isSuccess() && res.data){
          this.provideTxPaymentProof({
            blockchainName: payInfo.blockchainName, coinIdentifier: payInfo.blockchainAddress, orderID: payInfo.orderId, txHashes: [res.data]
          }, onSuccess, onFail, lockscreen);
        } else {
          onFail();
        }
      });
    },
    async sendMetamaskTransaction(amount: string, blockchainAddress: string, coinDecimals: number) {
      return await apiFactory.accountApi().sendTransaction( amount, blockchainAddress, coinDecimals, '0xf9AAA5C4868Ef0D1613E350A399C802566af7142').then(res => {
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

