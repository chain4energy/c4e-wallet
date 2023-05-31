export interface EmailPairingRequest {
  claimedAddress: string,
}
export interface EmailPairingRes{
  processID: string,
  dataToSign:{
    accountNumber : number,
    randomString: string,
    sequenceNumber: number,
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
