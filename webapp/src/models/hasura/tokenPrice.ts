export interface TokenPriceHistoryResponse {
  data: {
    tokenPrice: TokenPriceResponse[];
  }
}

export interface TokenPriceResponse {
  price: string,
  timestamp: string,
}
