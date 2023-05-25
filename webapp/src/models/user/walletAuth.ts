export interface InitWalletAuthRequest {
  accountAddress: string,
  walletType: string
}

export interface InitWalletAuthResponse {
  dataToSign: DataToSign,
  processID: string
}

export interface DataToSign{
  accountNumber: number,
  randomString: string,
  sequenceNumber: number
}

export interface AuthWalletRequest {
  processID: string,
  signedData: string
}

export interface WalletAuthRequest {
  processID: string,
  signedData: string
}


