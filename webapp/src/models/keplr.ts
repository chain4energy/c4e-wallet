import { Window as KeplrWindow } from "@keplr-wallet/types/build/window";
import {Keplr} from "@keplr-wallet/types/src/wallet";
import {OfflineSigner} from "@cosmjs/proto-signing/build/signer";
import {OfflineDirectSigner} from "@cosmjs/proto-signing";
import {SecretUtils} from "secretjs/types/enigmautils";

declare global{
  interface Window extends KeplrWindow{
    keplr?: Keplr;
    getOfflineSigner?: (chainId: string) => OfflineSigner & OfflineDirectSigner;
    getOfflineSignerOnlyAmino?: (chainId: string) => OfflineSigner;
    getOfflineSignerAuto?: (
      chainId: string
    ) => Promise<OfflineSigner | OfflineDirectSigner>;
    getEnigmaUtils?: (chainId: string) => SecretUtils;
  }
}
