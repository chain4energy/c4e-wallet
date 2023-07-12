export interface EmailPairingRequest {
  claimedAddress: string,
}
export interface EmailPairingRes{
  processID: string,
  dataToSign:{
    randomString: string,
  }
}
export interface SignedEmailPairingRequest{
  processID: string,
  signedData: string,
}

export interface EmailPairingConfirmationReq{
  pairingCode: string,
  processId: string,
  signedData: string,
}

export interface MetamaskKeplrPairingReq{
  keplrSignedData: string,
  metamaskSignedData: string,
  processID: string,
}

export interface SignParingAddressResult{
  processID: string,
  signedData: string
}
export interface EmailMetamaskPairingRequest {
  paymentAddress: string,
}
