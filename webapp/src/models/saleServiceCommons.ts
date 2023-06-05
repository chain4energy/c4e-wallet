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
