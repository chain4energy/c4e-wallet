import { Window as KeplrWindow } from "@keplr-wallet/types/build/window";

declare global{
  interface Window extends KeplrWindow {}
}

// export declare interface KeplrResponce{
//   err: object | string | unknown,
//   address: string,
// }
// export declare interface amount{
//   denom: string,
//   amount: string,
// }
