import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import { LoggedService } from '@/services/logged.service';
import { ChainInfo } from "@keplr-wallet/types";
import { useConfigurationStore } from "@/store/configuration.store";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";


const toast = useToast();

export enum ConnectionType {
  Address,
  Keplr,
}

export interface ConnectionInfo {
  account : string;
  modifiable: boolean;
  connectionType: ConnectionType;
}

export enum WalletResponseCode {
  OK,
  NOK,
}

export interface WalletResponse {
  code: WalletResponseCode,
  error: string
}

export interface WalletConnectionResponse extends WalletResponse {
  connectionInfo: ConnectionInfo
}

export default class WalletConnectionApi extends LoggedService {
  
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.WALLET_SERVICE;
  }

  public async connectAddress(address: string): Promise<WalletConnectionResponse> {
    const connection: ConnectionInfo = {
      account: address,
      connectionType: ConnectionType.Address,
      modifiable: false
    }
    const response: WalletConnectionResponse = {
      code: WalletResponseCode.OK,
      error: '',
      connectionInfo: connection
    }
    return response
  }
  
  public async connectKeplr(): Promise<WalletConnectionResponse> {
    useSplashStore().increment();
    try {
      if (window.keplr) {
        const chainInfo = this.createKeplrConfig();
        await window.keplr.experimentalSuggestChain(chainInfo);
        await window.keplr.enable(chainInfo.chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainInfo.chainId);
        const account = await offlineSigner.getAccounts();
        const connection: ConnectionInfo = {
          account: account[0].address,
          connectionType: ConnectionType.Keplr,
          modifiable: true
        }
        const response: WalletConnectionResponse = {
          code: WalletResponseCode.OK,
          error: '',
          connectionInfo: connection
        }
        return response
      } else {
        const response: WalletConnectionResponse = {
          code: WalletResponseCode.NOK,
          error: 'Install Keplr',
          connectionInfo: {
            account: '',
            connectionType: ConnectionType.Keplr,
            modifiable: true
          }
        }
        toast.error('Wallet Err: ' + response.error)
        return response  
      }
    } catch (error) {
      toast.error('Wallet Err: ' + error)
      const response: WalletConnectionResponse = {
        code: WalletResponseCode.NOK,
        error: 'Wallet Err: ' + error,
        connectionInfo: {
          account: '',
          connectionType: ConnectionType.Keplr,
          modifiable: true
        }
      }
      return response
    } finally {
      useSplashStore().decrement();
    }
  }
  
  private createKeplrConfig(): ChainInfo {
    const config = useConfigurationStore().config
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
    } as ChainInfo
    return chainInfo
  }
  
}

