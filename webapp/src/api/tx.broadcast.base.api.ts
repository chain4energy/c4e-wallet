import BaseApi from "@/api/base.api";
import { ConnectionType, ConnectionInfo } from "@/api/wallet.connecton.api";
import { useToast } from 'vue-toastification';
import { StdFee } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import { LocalSpinner } from "@/services/model/localSpinner";
import { LogLevel } from '@/services/logger/log-level';
import { SigningStargateClient, isDeliverTxFailure, DeliverTxResponse } from "@cosmjs/stargate";
import { useConfigurationStore } from "@/store/configuration.store";
import { RequestResponse } from '@/models/request-response';
import TxToast from "@/components/commons/TxToast.vue";
import {Keplr} from "@keplr-wallet/types";

const toast = useToast();

export class TxData {
  readonly height: number;
  readonly code: number;
  readonly transactionHash: string;
  readonly rawLog?: string;
  readonly gasUsed: number;
  readonly gasWanted: number;

  constructor (txResponse: DeliverTxResponse) {
    this.height = txResponse.height;
    this.code = txResponse.code;
    this.transactionHash = txResponse.transactionHash;
    this.rawLog = txResponse.rawLog;
    this.gasUsed = txResponse.gasUsed;
    this.gasWanted = txResponse.gasWanted;

  }

}

export class TxBroadcastError {
  readonly message: string;
  readonly txData?: TxData;

  constructor (message: string, txResponse?: DeliverTxResponse) {
    this.message = message;
    if (txResponse !== undefined) {
      this.txData = new TxData(txResponse);
    }
  }

  public hasTxData(): boolean {
    return this.txData !== undefined;
  }
}

export default abstract class TxBroadcastBaseApi extends BaseApi {

  protected createFee(gas: number, denom: string): StdFee {
    const fee: StdFee = {
      amount: [{
        denom: denom,
        amount: '0',
      }],
      gas: gas.toString(),
    };
    return fee;
  }

  protected async signAndBroadcast(
    connection: ConnectionInfo,
    getMessages: (isLedger: boolean) => readonly EncodeObject[] | TxBroadcastError,
    fee: StdFee | "auto" | number,
    memo: string,
    lockScreen: boolean, localSpinner: LocalSpinner | null,
    skipErrorToast = false
  ): Promise<RequestResponse<TxData, TxBroadcastError>>
  {
    this.logToConsole(LogLevel.DEBUG, 'signAndBroadcast');
    this.before(lockScreen, localSpinner);
    let clientToDisconnect: SigningStargateClient | undefined;
    try {
      if (!connection.modifiable) {
        return this.createTxErrorResponseWithToast(
          new TxBroadcastError('Cannot broadcast transaction with: ' + connection.connectionType + ' signer'),
          'Transaction Broadcast error',
          !skipErrorToast
        );
      }
      const { client, isLedger } = await this.createClient(connection.connectionType);
      clientToDisconnect = client;
      if (client === undefined) {
        return this.createTxErrorResponseWithToast(
          new TxBroadcastError('Cannot get signing client'),
          'Transaction Broadcast error',
          !skipErrorToast
        );
      }

      const messages = getMessages(isLedger);
      if (messages instanceof TxBroadcastError) {
        return new RequestResponse<TxData, TxBroadcastError>(messages);
      }
      const response = await client.signAndBroadcast(connection.account, messages, fee, memo);
      this.logToConsole(LogLevel.INFO, 'Client Response', this.stringify(response));
      if (isDeliverTxFailure(response)) {
        return this.createTxErrorResponseWithToast(
          new TxBroadcastError('Deliver tx failure', response),
          'Transaction Broadcast error',
          !skipErrorToast
        );
      }
      return new RequestResponse<TxData, TxBroadcastError>(undefined, new TxData(response));
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Client Response', this.stringify(err));
      const error = err as Error;
      return this.createTxErrorResponseWithToast(
        new TxBroadcastError(error.message),
        'Transaction Broadcast error',
        !skipErrorToast
      );
    } finally {
      this.after(lockScreen, localSpinner);
      if (clientToDisconnect !== undefined) {
        clientToDisconnect.disconnect();
      }
    }
  }
  protected async simulateDelegation(
    connection: ConnectionInfo,
    getMessages: (isLedger: boolean) => readonly EncodeObject[] | TxBroadcastError,
    fee: StdFee | "auto" | number,
    memo: string,
    lockScreen: boolean, localSpinner: LocalSpinner | null,
    skipErrorToast = false
  ) {
    try {
      this.logToConsole(LogLevel.DEBUG, 'simulateDelegation');
      this.before(lockScreen, localSpinner);
      const {client, isLedger} = await this.createClient(connection.connectionType);
      const messages = getMessages(isLedger);
      if (messages instanceof TxBroadcastError) {
        return new RequestResponse<TxData, TxBroadcastError>(messages);
      }
      const response = await client.simulate(connection.account, messages, memo);
      return response;
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Client Response', this.stringify(err));
      const error = err as Error;
      return this.createTxErrorResponseWithToast(
        new TxBroadcastError(error.message),
        'Transaction simulation error',
        !skipErrorToast
      );
    } finally {
      this.after(lockScreen, localSpinner);
    }
  }

  // protected async simulateTransaction(
  //   connection: ConnectionInfo,
  //   getMessages: (isLedger: boolean) => readonly EncodeObject[] | TxBroadcastError,
  //   fee: StdFee | "auto" | number,
  //   memo: string,
  //   lockScreen: boolean, localSpinner: LocalSpinner | null,
  //   skipErrorToast = false
  // ): Promise<any>{
  //   this.logToConsole(LogLevel.DEBUG, 'TransactionSimulation');
  //   let clientToDisconnect: SigningStargateClient | undefined;
  //   try {
  //     if (!connection.modifiable) {
  //       return this.createTxErrorResponseWithToast(
  //         new TxBroadcastError('Cannot broadcast transaction with: ' + connection.connectionType + ' signer'),
  //         'Transaction Broadcast error',
  //         !skipErrorToast
  //       );
  //     }
  //     const { client, isLedger } = await this.createClient(connection.connectionType);
  //     clientToDisconnect = client;
  //     if (client === undefined) {
  //       return this.createTxErrorResponseWithToast(
  //         new TxBroadcastError('Cannot get signing client'),
  //         'Transaction Broadcast error',
  //         !skipErrorToast
  //       );
  //     }
  //     const messages = getMessages(isLedger);
  //     if (messages instanceof TxBroadcastError) {
  //       return new RequestResponse<TxData, TxBroadcastError>(messages);
  //     }
  //     const response = await client.simulate(connection.account, messages, memo);
  //     this.logToConsole(LogLevel.INFO, 'Client Response', this.stringify(response));
  //     return new RequestResponse<TxData, TxBroadcastError>(undefined, response);
  //   } catch (err) {
  //     this.logToConsole(LogLevel.ERROR, 'Client Response', this.stringify(err));
  //     const error = err as Error;
  //     return this.createTxErrorResponseWithToast(
  //       new TxBroadcastError(error.message),
  //       'Transaction Broadcast error',
  //       !skipErrorToast
  //     );
  //   }
  // }

  private async createClient(connectionType: ConnectionType): Promise<{ client: SigningStargateClient, isLedger: boolean }> {
    const { signer, isLedger } = await this.getOfflineSigner(connectionType);
    if (signer == undefined) {
      throw new Error('Cannot get signer');
    }
    const rpc = useConfigurationStore().config.bcRpcURL;
    const client = await SigningStargateClient.connectWithSigner(
      rpc,
      signer,
    );
    return { client: client, isLedger: isLedger };
  }

  private async getOfflineSigner(connectionType: ConnectionType) {
    switch(connectionType) {
      case ConnectionType.Keplr: {
        return this.getOfflineSignerExtensionBased(window.keplr, 'Keplr not installed');
      }
      case ConnectionType.Cosmostation: {
        return this.getOfflineSignerExtensionBased(window.cosmostation?.providers.keplr, 'Cosmostation not installed');
      }
      case ConnectionType.Leap: {
        return this.getOfflineSignerExtensionBased(window.leap, 'Leap not installed');
      }
      default: {
        throw new Error('No signer for connnection type: ' + connectionType);
      }
    }
  }

  private async getOfflineSignerExtensionBased(extension: Keplr | undefined, errorMessage: string) {
    if(extension) {
      const chainId = useConfigurationStore().config.chainId;
      const isLedger = (await extension?.getKey(chainId)).isNanoLedger;
      const offlineSigner = isLedger ? extension.getOfflineSignerOnlyAmino(chainId) : extension.getOfflineSigner(chainId);
      return {signer: offlineSigner, isLedger: isLedger};
    }
    throw new Error(errorMessage);
  }

  private createTxErrorResponseWithToast(errorData: TxBroadcastError,toastMessageBeginning: string | undefined, showErrorToast: boolean): RequestResponse<TxData, TxBroadcastError> {
    if (showErrorToast) {
      const errorDataString = toastMessageBeginning;
      if (errorData.txData !== undefined) {
        const content = {
          component: TxToast,
          props: {
            tx: errorData.txData,
            errorTitleMessage: errorDataString
          },
        };
        toast.error(content);
      } else {
        const content = {
          component: TxToast,
          props: {
            tx: errorData.txData,
            errorTitleMessage: errorDataString,
            errorMessage: errorData.message
          },
        };
        toast.error(content);
      }
    }
    return new RequestResponse<TxData, TxBroadcastError>(errorData);
  }
}
