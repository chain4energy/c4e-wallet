import {Coin} from "@/models/store/common";
import {BigDecimal} from "@/models/store/big.decimal";

export interface ReserveTokensRequest {
  amount: number
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
  orderId: number;
  status: RESERVATION_STATUS;
  amountRequested: number;
  orderEndTime: string;
  reservationEndTime: string;
  transactions: Transaction[]
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
export interface Transaction {
  txHash: string;
  amount: string;
  errorInfo: TRANSACTION_STATUS;
  blockchain: string;
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

export interface RoundInfoBlockchainInfo {
  roundInfo: RoundInfo;
  blockchainInfo: BlockchainInfo[];
}

export interface uC4eToUsd{
  amount: number;
  decimal: number;
}
