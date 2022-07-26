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
  
  protected async signAndBroadcast(connection: ConnectionInfo, 
                                  messages: readonly EncodeObject[], fee: StdFee | "auto" | number, memo: string,
                                  lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<TxData, TxBroadcastError>> {
    this.before(lockScreen, localSpinner);
    let client: SigningStargateClient | undefined;
    try {
      if (!connection.modifiable) {
        return this.createTxErrorResponseWithToast(
          new TxBroadcastError('Cannot broadcast transaction with: ' + connection.connectionType + ' signer'),
          'Transaction Broadcast error',
          !skipErrorToast
        );
        // return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('Cannot broadcast transaction with: ' + connection.connectionType + ' signer'));
      }
      client = await this.createClient(connection.connectionType);
      if (client == undefined) {
        return this.createTxErrorResponseWithToast(
          new TxBroadcastError('Cannot get signing client'),
          'Transaction Broadcast error',
          !skipErrorToast
        );
        // return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('Cannot get client'));
      }
      const response = await client.signAndBroadcast(connection.account, messages, fee, memo);
      this.logToConsole(LogLevel.INFO, 'Client Response', this.stringify(response));
      if (isDeliverTxFailure(response)) {
        return this.createTxErrorResponseWithToast(
          new TxBroadcastError('Deliver tx failure', response),
          'Transaction Broadcast error',
          !skipErrorToast
        );
        // return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('Transaction Broadcast error', response));
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
      // if (!skipErrorToast) {
      //   toast.error('Error broadcasting transaction:' + error.message);
      // }
      // return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError(error.message));
    }finally {
      this.after(lockScreen, localSpinner);
      if (client !== undefined) {
        client.disconnect();
      }
    }
  }
  
  private createClient(connectionType: ConnectionType): Promise<SigningStargateClient> {
    const signer = this.getOfflineSigner(connectionType);
    if (signer == undefined) {
      throw new Error('Cannot get signer');
    }
    const rpc = useConfigurationStore().config.bcRpcURL;
    const client = SigningStargateClient.connectWithSigner(
      rpc,
      signer,
    );
    return client;
  }
  
  private getOfflineSigner(connectionType: ConnectionType) {
    switch(connectionType) {
      case ConnectionType.Keplr: {
        if(window.keplr) {
          const chainId = useConfigurationStore().config.chainId;
          const offlineSigner = window.keplr.getOfflineSigner(chainId);
          return offlineSigner;
        }
        throw new Error('Keplr not installed');
      }
      default: {
        throw new Error('No signer for connnection type: ' + connectionType);
      }
    }
  }

  private createTxErrorResponseWithToast(errorData: TxBroadcastError,toastMessageBeginning: string | undefined, showErrorToast: boolean): RequestResponse<TxData, TxBroadcastError> {
    if (showErrorToast) {
      let errorDataString = errorData.message;
      if (errorData.txData !== undefined) {
        errorDataString += '\r\nTx: ' + errorData.txData.transactionHash;
        errorDataString += '\r\n\tHeight: ' + errorData.txData.height;
        errorDataString += '\r\n\tCode: ' + errorData.txData.code;
      }
      toast.error(toastMessageBeginning + this.getServiceType() + '\r\n' + errorDataString);
    }
    return new RequestResponse<TxData, TxBroadcastError>(errorData);
  }
}
