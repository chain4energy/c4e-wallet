import {Keplr} from "@keplr-wallet/types";
import {Cosmos} from "@cosmostation/extension-client";
import {CosmostationWindow} from "@/models/comostationWindow";

export interface MetmaskWindow {
  ethereum: any
}
declare global{
  interface Window extends MetmaskWindow {}
}
