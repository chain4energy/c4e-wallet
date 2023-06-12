import {Coin} from "@/models/store/common";

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
  status: string;
  amountRequested: number;
  orderEndTime: string;
  reservationEndTime: string;
  transactions: Transaction[]
}

export interface Transaction {
  txHash: string;
  amount: string;
  errorInfo: string;
  blockchain: string;
}

export interface TokenPaymentProofRequest{
  blockchainName:	string;
  coinIdentifier:	string;
  orderID:	number;
  txHashes:	string[];
}

export interface MetamaskPayInfo {
  blockchainName: string;
  orderId: number;
  amount: string;
  blockchainAddress: string;
  coinDecimals: number;
  c4eAddress: string;
}

export interface BlockchainInfo {
  availableTokens: TokenInfo[];
  chainId: number;
  chainName: string;
  id: number;
}
export interface TokenInfo {
  c4eAddress: string;
  coinIdentifier: string;
  exchangeRate: number;
  id: number;
  name: string;

}
export interface RoundInfoResponse {
  availableTokens: number;
  c4eToUsd: number;
  endDate: string;
  startDate: string;
  id: number;
}
export interface RoundInfo {
  availableTokens: Coin;
  c4eToUsd: number;
  endDate: Date;
  startDate: Date;
  id: number;
}

