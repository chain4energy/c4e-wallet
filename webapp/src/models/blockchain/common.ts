export interface Coin {
  denom: string,
  amount: string
}

export interface BlockchainApiErrorData {
  code: number;
  message: string;
  details?: string;

}