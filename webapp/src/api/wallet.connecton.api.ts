import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import { LoggedService } from '@/services/logged.service';
import { ChainInfo } from "@keplr-wallet/types";
import { useConfigurationStore } from "@/store/configuration.store";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { RequestResponse } from '@/models/request-response';


const toast = useToast();

export enum ConnectionType {
  Address,
  Keplr,
  Disconnected
}

export class ConnectionInfo {

  static disconnected = new ConnectionInfo();

  readonly account: string;
  readonly modifiable: boolean;
  readonly connectionType: ConnectionType;

  constructor(
    account = '',
    modifiable = false,
    connectionType = ConnectionType.Disconnected) {
    this.account = account;
    this.modifiable = modifiable;
    this.connectionType = connectionType;
  }

}

export class ConnectionError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export default class WalletConnectionApi extends LoggedService {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.WALLET_SERVICE;
  }

  public async connectAddress(address: string): Promise<RequestResponse<ConnectionInfo, ConnectionError>> {
    const connection: ConnectionInfo = new ConnectionInfo(
      address,
      false,
      ConnectionType.Address,
    );
    return new RequestResponse<ConnectionInfo, any>(undefined, connection);
  }

  public async connectKeplr(): Promise<RequestResponse<ConnectionInfo, ConnectionError>> {
    useSplashStore().increment();
    try {
      if (window.keplr) {
        const chainInfo = this.createKeplrConfig();
        await window.keplr.experimentalSuggestChain(chainInfo);
        await window.keplr.enable(chainInfo.chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainInfo.chainId);
        const account = await offlineSigner.getAccounts();
        const connection: ConnectionInfo = new ConnectionInfo(
          account[0].address,
          true,
          ConnectionType.Keplr,
        );
        return new RequestResponse<ConnectionInfo, any>(undefined, connection);
      } else {
        const message = 'Keplr not installed';
        toast.error(message);
        return new RequestResponse<ConnectionInfo, ConnectionError>(new ConnectionError(message));
      }
    } catch (error) {
      toast.error('Wallet Err: ' + error);
      return new RequestResponse<ConnectionInfo, ConnectionError>(new ConnectionError('' + error));
    } finally {
      useSplashStore().decrement();
    }
  }

  private createKeplrConfig(): ChainInfo {
    const config = useConfigurationStore().config;
    const chainInfo = {
      chainId: config.chainId,
      chainName: config.chainId,
      rpc: config.bcRpcURL,
      rest: config.bcApiURL,
      bip44: {
        coinType: 118
      },
      bech32Config: {
        bech32PrefixAccAddr: config.addressPrefix,
        bech32PrefixAccPub: config.addressPrefix + "pub",
        bech32PrefixValAddr: config.addressPrefix + "valoper",
        bech32PrefixValPub: config.addressPrefix + "valoperpub",
        bech32PrefixConsAddr: config.addressPrefix + "valcons",
        bech32PrefixConsPub: config.addressPrefix + "valconspub"
      },
      stakeCurrency: {
        coinDenom: "C4E",
        coinMinimalDenom: config.stakingDenom,
        coinDecimals: 1e-6
      },
      feeCurrencies: [
        {
          coinDenom: "C4E",
          coinMinimalDenom: config.stakingDenom,
          coinDecimals: 1e-6
        }
      ],
      currencies: [
        {
          coinDenom: "C4E",
          coinMinimalDenom: config.stakingDenom,
          coinDecimals: 1e-6
        }
      ],
      coinType: 118,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03,
      },
      walletUrlForStaking: config.stakingPageURL
    } as ChainInfo;
    return chainInfo;
  }

}

