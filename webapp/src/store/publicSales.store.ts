import {defineStore} from "pinia";
import {Coin, DecCoin} from "@/models/store/common";
import {useConfigurationStore} from "@/store/configuration.store";
import factoryApi from "@/api/factory.api";
import apiFactory from "@/api/factory.api";
import {
  BLOCKCHAIN,
  BLOCKCHAIN_STATUS,
  BlockchainInfo,
  InitPaymentSessionRequest,
  MetamaskPayInfo,
  PAYMENT_TYPE,
  RESERVATION_STATUS,
  RoundInfo,
  RoundInfoBlockchainInfo,
  TOKEN_NAME,
  TokenPaymentProofRequest, TRANSACTION_CURRENCY,
  TRANSACTION_STATUS
} from "@/models/saleServiceCommons";
import {BigDecimal} from "@/models/store/big.decimal";
import {PublicSaleErrorHandler} from "@/store/errorsHandlers/publicSaleErrorHandler";

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

export class BlockchainTxStore {

  amount: number;
  coinIdentifier: string;
  coinName: TOKEN_NAME;

  constructor(amount: number, coinIdentifier: string, coinName: TOKEN_NAME) {
    this.amount = amount;
    this.coinIdentifier = coinIdentifier;
    this.coinName = coinName;
  }

  getInC4E() {
    return new BigDecimal(this.amount).divide(usePublicSalesStore().getC4eToUSD);
  }
}
export class StoreTransaction {
  blockchainStatus: BLOCKCHAIN_STATUS;
  status: TRANSACTION_STATUS;
  txHash: string;
  type: PAYMENT_TYPE;
  blockchainTxs: BlockchainTxStore[];
  currencyCode: TRANSACTION_CURRENCY;
  amount: number;
  blockchain: BLOCKCHAIN;
  constructor(blockchainStatus: BLOCKCHAIN_STATUS, status: TRANSACTION_STATUS, txHash: string, type: PAYMENT_TYPE, blockchainTxs: BlockchainTxStore[], currencyCode: TRANSACTION_CURRENCY, amount: number, blockchain: BLOCKCHAIN) {
    this.blockchainStatus = blockchainStatus;
    this.status = status;
    this.txHash = txHash;
    this.type = type;
    this.blockchainTxs = blockchainTxs;
    this.currencyCode = currencyCode;
    this.amount = amount;
    this.blockchain = blockchain;
  }

  getTransactionLink() {
    switch (this.blockchain) {
      case BLOCKCHAIN.BSC:
        return 'https://testnet.bscscan.com/tx/'+this.txHash;
      case BLOCKCHAIN.POLYGON:
        return 'https://mumbai.polygonscan.com/tx/'+this.txHash;
      case BLOCKCHAIN.SEPOLIA:
        return 'https://sepolia.etherscan.io/tx/'+this.txHash;
    }
  }

  getSumOfPaymentsInStableCoin() {
    let sumOfPayments  = 0;
    this.blockchainTxs.forEach(tx => {
      sumOfPayments += tx.amount;
    });
    return new BigDecimal(sumOfPayments);
  }

  getSumOfPayments(token: TOKEN_NAME) {
    let sumOfPayments  = 0;
    this.blockchainTxs.forEach(tx => {
      if(tx.coinName == token)
        sumOfPayments += tx.amount;
    });
    return new BigDecimal(sumOfPayments);
  }
}

export class TokenReservation {
  amountRequested: DecCoin;
  orderEndTime: Date;
  orderId: number;
  reservationEndTime: Date;
  roundId: number;
  status: RESERVATION_STATUS;
  transactions: StoreTransaction[];
  unconfirmed: boolean;
  timestamp: Date;

  constructor(
    orderId: number,
    amountRequested: DecCoin,
    status: RESERVATION_STATUS,
    transactions: StoreTransaction[],
    reservationEndTime: Date,
    orderEndTime: Date,
    roundId: number,
    unconfirmed: boolean,
    timestamp: Date
  ) {
    this.orderId = orderId;
    this.amountRequested = amountRequested;
    this.status = status;
    this.transactions = transactions;
    this.reservationEndTime = reservationEndTime;
    this.orderEndTime = orderEndTime;
    this.roundId = roundId;
    this.unconfirmed = unconfirmed;
    this.timestamp = timestamp;
  }

  leftToPayInStableCoin() {
    let sumOfPayments  = 0;
    this.transactions.forEach(transaction => {
      transaction.blockchainTxs.forEach(blockchainTx => {
        sumOfPayments+=blockchainTx.amount;
      });
    });

    return this.amountRequested.amount.multiply(usePublicSalesStore().getuC4eToUSD).subtract(new BigDecimal(sumOfPayments));
  }

  leftToBuyC4E() {
    return this.leftToPayInStableCoin().divide(usePublicSalesStore().getC4eToUSD);
  }

  getOverpaid() {
    if(this.status != RESERVATION_STATUS.OVERPAID) {
      return new BigDecimal(0);
    }

    return this.getSumOfPaymentsInStableCoin().subtract(this.amountRequested.amount.multiply(usePublicSalesStore().getuC4eToUSD));
  }

  getSumOfPaymentsInStableCoin() {
    let sumOfPayments  = 0;
    this.transactions.forEach(transaction => {
      transaction.blockchainTxs.forEach(blockchainTx => {
        sumOfPayments+=blockchainTx.amount;
      });
    });
    return new BigDecimal(sumOfPayments);
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
      return factoryApi.publicSaleServiceApi().fetchReservationList(lockscreen).then(response => {
        if(response.isSuccess() && response.data) {
          this.tokenReservations = response.data;
        } else {
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          // onFail?.();
        }
      });
    },
    reserveTokens(roundId: number, amount: number, onSuccess: ((orderId: number) => void), onFail?: (() => void), lockscreen = true) {
      return factoryApi.publicSaleServiceApi().reserveTokens(roundId, amount, lockscreen).then(response => {
        if(response.isSuccess() && response.data?.orderId) {
          onSuccess(response.data.orderId);
        } else {
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    cancelReservation(orderId: number, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      return factoryApi.publicSaleServiceApi().cancelReservation(orderId, lockscreen).then(response => {
        if(response.isSuccess()) {
          onSuccess();
        } else {
          // onFail(res.error?.data?.message);
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    initPaymentSession(initPaymentSessionRequest: InitPaymentSessionRequest, onFail?: (() => void), lockscreen = true) {
      return factoryApi.publicSaleServiceApi().initPaymentSession(initPaymentSessionRequest, lockscreen).then(response => {
        if(response.isSuccess() && response.data){
          return response.data?.transactionId;
        }else{
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    fetchBlockchainInfo(onFail?: (() => void), lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchBlockchainInfo(lockscreen).then(response => {
        if(response.isSuccess() && response.data) {
          this.blockchainInfo = response.data;
        }else{
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    fetchRoundInfo(roundId: number, onFail?: (() => void), lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchRoundInfo(roundId, lockscreen).then(response => {
        if(response.isSuccess() && response.data) {
          this.roundInfo = response.data.roundInfo;
          this.blockchainInfo = response.data.blockchainInfo;
        } else {
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    fetchRoundInfoList(onFail?: (() => void), lockscreen = false) {
      return factoryApi.publicSaleServiceApi().fetchRoundInfoList( lockscreen).then(response => {
        if(response.isSuccess() && response.data) {
          this.roundInfoMap = response.data.roundInfoMap;

          // if(res.data.activeRoundInfo) {
          //   this.roundInfo = res.data.activeRoundInfo.roundInfo;
          //   this.blockchainInfo = res.data.activeRoundInfo.blockchainInfo;
          // }

        } else {
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async provideTxPaymentProof(txPaymentProofRequest: TokenPaymentProofRequest, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      await apiFactory.publicSaleServiceApi().provideTxPaymentProof( txPaymentProofRequest, lockscreen).then(response => {
        if(response.isSuccess()) {
          onSuccess();
        } else {
          PublicSaleErrorHandler.getInstance().handleError(response.error);
          onFail?.();
        }
      });
    },
    async payByMetamask(payInfo: MetamaskPayInfo, onSuccess: (() => void), onFail?: (() => void), lockscreen = true) {
      this.sendMetamaskTransaction(payInfo.amount, payInfo.blockchainAddress, payInfo.coinDecimals, payInfo.c4eAddress).then(res => {
        if (res.isSuccess() && res.data){
          this.provideTxPaymentProof({
            blockchainID: payInfo.blockchainID, exchangeID: payInfo.exchangeID, orderID: payInfo.orderId, txHashes: [res.data]
          }, onSuccess, onFail, lockscreen);
        } else {
          onFail?.();
        }
      });
    },
    async sendMetamaskTransaction(amount: string, blockchainAddress: string, coinDecimals: number, c4eAddress: string) {
      return await apiFactory.accountApi().sendTransaction( amount, blockchainAddress, coinDecimals, c4eAddress).then(res => {
        console.log(res);
        return res;
      });
    },
    logoutAccount(){
      this.tokenReservations = [];
    },
    toggleWarning(value: boolean){
      this.warning = value;
    }
  },
  getters: {
    getTotal(): Coin | undefined {
      return this.total;
    },
    getParts(): parts | undefined {
      if (this.roundInfo)
        return {sold: this.roundInfo.soldTokens, reserved: this.roundInfo.reservedTokens};
      return undefined;
    },
    getStartDate(): Date | undefined {
      return this.startDate;
    },
    getEndDate(): Date | undefined {
      return this.endDate;
    },
    getTransactions(): TokenReservation[] | undefined {
      return this.tokenReservations?.sort((a, b) => b.orderEndTime.getTime() - a.orderEndTime.getTime());
    },
    getC4eToUSD(): BigDecimal {
      if (this.roundInfo?.uC4eToUsd) {
        return this.roundInfo.uC4eToUsd.multiply(useConfigurationStore().config.getViewDenomConversionFactor('uc4e'));
      }
      return new BigDecimal(0);
    },
    getuC4eToUSD(): BigDecimal {
      if (this.roundInfo?.uC4eToUsd) {
        return this.roundInfo.uC4eToUsd;
      }
      return new BigDecimal(0);
    },
    getWarning(): boolean {
      return this.warning;
    }
  }
});

