export interface TokenPriceHistoryResponse {
  data: {
    tokenPrice: TokenPriceResponse[];
  }
}

export interface TokenPriceResponse {
  price: number,
  timestamp: string,
}
