import {Coin} from "@/models/store/common";
import {BigDecimal} from "@/models/store/big.decimal";

export interface ReserveTokensRequest {
  roundId: number;
  amount: number;
}

export interface ReserveTokensResponse {
  orderId: number
}

export interface InitPaymentSessionRequest {
  orderId: number;
  offeredCurrencyCode: string;
  offeredAmount: number;
}

export interface InitPaymentSessionResponse {
  transactionId: string;
}

export interface TokenReservationResponse {
  amountRequested: number;
  orderEndTime: string;
  orderId: number;
  reservationEndTime: string;
  roundId: number;
  status: RESERVATION_STATUS;
  transactions?: Transaction[];
  unconfirmed: boolean;
}

export enum RESERVATION_STATUS {
  DECLARED="DECLARED",
  PENDING='PENDING',
  PARTIALLY_PAID='PARTIALLY_PAID',
  OVERPAID='OVERPAID',
  COMPLETED='COMPLETED',
  REJECTED='REJECTED',
  CANCELED='CANCELED'
}
export enum TRANSACTION_STATUS {
  NOT_VERIFIED='NOT_VERIFIED',
  TRANSFER_COVERED='TRANSFER_COVERED',
  INSUFFICIENT_TRANSFER='INSUFFICIENT_TRANSFER',
  EXCEEDED_TRANSFER='EXCEEDED_TRANSFER',
  INCORRECT_TOKEN='INCORRECT_TOKEN',
  INVALID_TX_HASH='INVALID_TX_HASH',
  TRANSFER_SOURCE_ADDRESS_UNRECOGNIZED='TRANSFER_SOURCE_ADDRESS_UNRECOGNIZED',
  TRANSFER_RECIPIENT_ADDRESS_INCORRECT='TRANSFER_RECIPIENT_ADDRESS_INCORRECT',
  TX_UNSUCCESSFUL='TX_UNSUCCESSFUL',
  TX_NOT_CONFIRMED='TX_NOT_CONFIRMED'
}

export enum BLOCKCHAIN_STATUS {
  UNCONFIRMED='UNCONFIRMED',
  CONFIRMED='CONFIRMED',
  PREPARATION='PREPARATION',
  NOT_VERIFIED='NOT_VERIFIED'
}
export enum PAYMENT_TYPE {
  COIN='COIN',
  FIAT='FIAT'
}

export enum BLOCKCHAIN {
  SEPOLIA ='SEPOLIA',
  BSC='BSC',
  POLYGON='POLYGON'
}
export interface Transaction {
  blockchainStatus: BLOCKCHAIN_STATUS;
  status: string;
  txHash: string;
  type: PAYMENT_TYPE;
  blockchainTxs?: BlockchainTx[];
  currencyCode: string;
  amount: string;
  blockchain: BLOCKCHAIN;
}

export interface BlockchainTx {
  amount: string;
  coinIdentifier: string;
  coinName: string;
}
export interface TokenPaymentProofRequest{
  blockchainID:	number;
  exchangeID:	number;
  orderID:	number;
  txHashes:	string[];
}

export interface MetamaskPayInfo {
  blockchainID: number;
  exchangeID: number;
  orderId: number;
  amount: string;
  blockchainAddress: string;
  coinDecimals: number;
  c4eAddress: string;
}

export interface BlockchainInfo {
  tokenExchanges: TokenInfo[];
  chainId: number;
  chainName: string;
  id: number;
}
export interface TokenInfo {
  recipientAddress: string;
  coinIdentifier: string;
  exchangeRate: uC4eToUsd;
  id: number;
  name: string;
  decimals: number;
}
export interface RoundInfoResponse {
  active: boolean;
  blockchains: BlockchainInfo[];
  endDate: string;
  startDate: string;
  availableTokens: number;
  name: string;
  reservedTokens: number;
  soldTokens: number;
  totalTokens: number;
  uC4eToUsd: uC4eToUsd;
  id: number;
}
export interface RoundInfo {
  availableTokens: Coin;
  reservedTokens: Coin;
  soldTokens: Coin;
  totalTokens: Coin;
  uC4eToUsd: BigDecimal;
  endDate: Date;
  startDate: Date;
  id: number;
  name: string;
}
export interface RoundInfoListMapped {
  activeRoundInfo: RoundInfoBlockchainInfo | undefined;
  roundInfoMap: Map<number, RoundInfoBlockchainInfo>;
}
export interface RoundInfoBlockchainInfo {
  roundInfo: RoundInfo;
  blockchainInfo: BlockchainInfo[];
}

export interface uC4eToUsd{
  amount: number;
  decimal: number;
}
