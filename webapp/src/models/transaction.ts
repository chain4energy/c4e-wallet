export declare class transaction {
  amount : string;
  address : string;
  type : string;
}

export declare interface redelegation{
  delegatorAddress: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  amount: string,
}
