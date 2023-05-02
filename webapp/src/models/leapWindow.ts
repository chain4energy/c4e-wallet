import {Keplr} from "@keplr-wallet/types";

export interface LeapWindow {
  leap: Keplr;
}

declare global{
  interface Window extends LeapWindow {}
}
