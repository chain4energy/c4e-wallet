import { useSplashStore } from '@/store/splash.store';
import { useToast } from 'vue-toastification';
import { LoggedService } from '@/services/logged.service';
import {ChainInfo, Keplr} from "@keplr-wallet/types";
import { useConfigurationStore } from "@/store/configuration.store";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { RequestResponse } from '@/models/request-response';
import { LogLevel } from '@/services/logger/log-level';
import {ethers, Signer} from "ethers";


const toast = useToast();

export enum ConnectionType {
  Address,
  Keplr,
  Disconnected,
  Cosmostation,
  Metamask,
  Leap,
  Email,
}

export class ConnectionInfo {

  // static readonly disconnected = new ConnectionInfo();

  readonly account: string;
  readonly modifiable: boolean;
  readonly connectionType: ConnectionType;
  readonly pubKey?: Uint8Array;
  readonly accountName?: string;
  constructor(
    account = '',
    modifiable = false,
    connectionType = ConnectionType.Disconnected,
    pubKey?: Uint8Array,
    accountName?: string) {
    this.account = account;
    this.modifiable = modifiable;
    this.connectionType = connectionType;
    this.pubKey = pubKey;
    this.accountName = accountName;

  }

  public isKeplr(): boolean {
    return this.connectionType === ConnectionType.Keplr;
  }

  public isAddress(): boolean {
    return this.connectionType === ConnectionType.Address;
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
    return ServiceTypeEnum.WALLET_API;
  }

  public async connectAddress(address: string): Promise<RequestResponse<ConnectionInfo, ConnectionError>> {
    const connection: ConnectionInfo = new ConnectionInfo(
      address,
      false,
      ConnectionType.Address,
    );
    return new RequestResponse<ConnectionInfo, any>(undefined, connection);
  }

  public connectKeplr(): Promise<RequestResponse<ConnectionInfo, ConnectionError>> {
      return this.connect(ConnectionType.Keplr);
  }

  public connectCosmostation(): Promise<RequestResponse<ConnectionInfo, ConnectionError>> {
    return this.connect(ConnectionType.Cosmostation);
  }

  public connectLeap(): Promise<RequestResponse<ConnectionInfo, ConnectionError>> {
    return this.connect(ConnectionType.Leap);
  }
  public async connectMetamask(): Promise<RequestResponse<string, ConnectionError>> {
    const ethereum = window.ethereum;
    if (typeof window.ethereum !== 'undefined') {
      console.log('Eth wallet is installed!');
    }
    if (ethereum.isMetaMask) {
      console.log('MetaMask is installed!');
    }

    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    const account = accounts[0];
    console.log('account is: ' + account);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const address = await signer.getAddress();

    return new RequestResponse<string, any>(undefined, address);
  }
  public async connect(connectionType: ConnectionType): Promise<RequestResponse<ConnectionInfo, ConnectionError>> {
    useSplashStore().increment();
    let extension: Keplr | undefined;
    let connectTypeMessage = '';
    let notInstalledMessage = '';
    if(connectionType == ConnectionType.Keplr) {
      extension = window.keplr;
      connectTypeMessage = 'connectKeplr';
      notInstalledMessage = 'Keplr not installed';
    } else if(connectionType == ConnectionType.Cosmostation){
      extension = window.cosmostation?.providers.keplr;
      connectTypeMessage = 'connectCosmostation';
      notInstalledMessage = 'Cosmostation not installed';
    } else if(connectionType == ConnectionType.Leap) {
      extension = window.leap;
      connectTypeMessage = 'connectLeap';
      notInstalledMessage = 'Leap not installed';
    }

    try {
      if (extension) {
        const chainInfo = this.createKeplrConfig();
        await extension.experimentalSuggestChain(chainInfo);
        await extension.enable(chainInfo.chainId);
        const key = await extension.getKey(chainInfo.chainId);
        const offlineSigner = extension.getOfflineSigner(chainInfo.chainId);
        const account = await offlineSigner.getAccounts();

        const connection: ConnectionInfo = new ConnectionInfo(
          account[0].address,
          true,
          connectionType,
          account[0].pubkey,
          key?.name,
        );
        return new RequestResponse<ConnectionInfo, any>(undefined, connection);
      } else {
        this.logToConsole(LogLevel.ERROR, connectTypeMessage+': '+notInstalledMessage);
        toast.error(notInstalledMessage);
        return new RequestResponse<ConnectionInfo, ConnectionError>(new ConnectionError(notInstalledMessage));
      }
    } catch (error) {
      this.logToConsole(LogLevel.ERROR, connectTypeMessage+': Error', JSON.stringify(error));
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
      chainName: config.keplrNetworkName,
      rpc: config.bcRpcURL,
      rest: config.bcApiURL,
      bip44: {
        coinType: 4444
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
        coinDenom: config.getConvertedDenom(),
        coinMinimalDenom: config.stakingDenom,
        coinDecimals: config.getViewDenomDecimals()
      },
      feeCurrencies: [
        {
          coinDenom: config.getConvertedDenom(),
          coinMinimalDenom: config.stakingDenom,
          coinDecimals: config.getViewDenomDecimals()
        }
      ],
      currencies: [
        {
          coinDenom: config.getConvertedDenom(),
          coinMinimalDenom: config.stakingDenom,
          coinDecimals: config.getViewDenomDecimals()
        }
      ],
      coinType: 118,
      gasPriceStep: {
        low: config.keplrGasPriceSteps.low,
        average: config.keplrGasPriceSteps.average,
        high: config.keplrGasPriceSteps.high,
      },
      walletUrlForStaking: config.stakingPageURL
    } as ChainInfo;
    return chainInfo;
  }

}

