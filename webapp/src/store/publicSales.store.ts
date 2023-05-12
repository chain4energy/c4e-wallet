import { defineStore } from "pinia";
import {Coin} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
export interface PublicSalesState{
  total: Coin | undefined,
  parts: parts | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  c4eToUSDC: number | undefined,
  transactions: Transactions[] | undefined,
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

export class Transactions {
  amount: Coin;
  paymentType: paymentType;
  status: transactionStatus;
  txHash?: string;
  blockchainType?: string;
  constructor(amount: Coin, paymentType: paymentType, status: transactionStatus, txHash?: string, blockchainType?: string) {
    this.amount = amount;
    this.paymentType = paymentType;
    this.status = status;
    this.txHash = txHash;
    this.blockchainType = blockchainType
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
      transactions: undefined,
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
    setTransactions(){
      const res = getFakeTransactionsData();
      const denom = useConfigurationStore().config.stakingDenom;
      const transactions = Array<Transactions>();
      res.forEach((el)=>{
        const amount = new Coin(BigInt(el.amount), denom);
        let curPaymentType = paymentType.updating;
        let curStatus = transactionStatus.updating;
        switch (el.paymentType){
          case 'Crypto': curPaymentType = paymentType.Crypto;
          break;
          case 'StandardCurrency': curPaymentType = paymentType.StandardCurrency;
          break;
        }
        switch (el.status) {
          case 'Declared': curStatus = transactionStatus.Declared;
            break;
          case 'Paid': curStatus = transactionStatus.Paid;
            break;
          case 'Error': curStatus = transactionStatus.Error;
            break;
        }
        const transaction = new Transactions(amount, curPaymentType, curStatus, el.txHash, el.blockChainType);
        transactions.push(transaction);
      });
      this.transactions = transactions;
    },
    setCurrentPrice(){
      this.c4eToUSDC = 0.1;
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
    getTransactions(): Transactions[] | undefined{
      return this.transactions;
    }
  }
});

function getFakeTransactionsData() {
  return [
    {
      amount: '1000000000',
      paymentType: 'Crypto',
      status: 'Declared',
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

