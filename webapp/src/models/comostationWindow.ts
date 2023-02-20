import {Keplr} from "@keplr-wallet/types";
import {Cosmos} from "@cosmostation/extension-client";

export interface CosmostationWindow {
  cosmostation?: {
    version: string;
    cosmos: Cosmos;
    providers: {
      keplr: Keplr;
    };
  };
}
