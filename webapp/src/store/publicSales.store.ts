import { defineStore } from "pinia";
import {Coin} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import factoryApi from "@/api/factory.api";
import {Transaction} from "@/models/saleServiceCommons";
export interface PublicSalesState{
  total: Coin | undefined,
  parts: parts | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  c4eToUSDC: number | undefined,
  tokenReservations: TokenReservation[] | undefined,
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
      return factoryApi.saleServiceApi().fetchReservationList(lockscreen).then(res => {
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
    setCurrentPrice(){
      this.c4eToUSDC = 0.18;
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

