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

}

export default abstract class TxBroadcastBaseApi extends BaseApi {

  protected createFee(gas: string, denom: string): StdFee {
    const fee: StdFee = {
      amount: [{
        denom: denom,
        amount: '0',
      }],
      gas: gas,
    };
    return fee
  }
  
  protected async signAndBroadcast(connection: ConnectionInfo, 
                                  messages: readonly EncodeObject[], fee: StdFee | "auto" | number, memo: string,
                                  lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<RequestResponse<TxData, TxBroadcastError>> {
    this.before(lockScreen, localSpinner);
    try {
      if (!connection.modifiable) {
        return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('Cannot modify using: ' + connection.connectionType + ' signer'));
      }
      const client = await this.createClient(connection.connectionType)
      if (client == undefined) {
        return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('Cannot get client'));
      }
      const response = await client.signAndBroadcast(connection.account, messages, fee, memo);
      this.logToConsole(LogLevel.INFO, 'Client Response', JSON.stringify(response));
      if (isDeliverTxFailure(response)) {
        return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('Cannot get client', response));
      }
      return new RequestResponse<TxData, TxBroadcastError>(undefined, new TxData(response));
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Client Response', JSON.stringify(err));
      const error = err as Error;
      if (!skipErrorToast) {
        toast.error('Error requesting service:' + this.getServiceType());
      }
      return new RequestResponse<TxData, TxBroadcastError>(new TxBroadcastError('err'));
    }finally {
      this.after(lockScreen, localSpinner);
    }
  }
  
  private createClient(connectionType: ConnectionType) {
    const signer = this.getOfflineSigner(connectionType)
    if (signer == undefined) {
      return undefined
    }
    const rpc = useConfigurationStore().config.bcRpcURL
    const client = SigningStargateClient.connectWithSigner(
      rpc,
      signer,
    );
    return client
  }
  
  private getOfflineSigner(connectionType: ConnectionType) {
    switch(connectionType) {
      case ConnectionType.Keplr: {
        if(window.keplr) {
          const chainId = useConfigurationStore().config.chainId
          const offlineSigner = window.keplr.getOfflineSigner(chainId);
          return offlineSigner
        }
        return undefined
      }
      default: {
        return undefined
      }
    }
  }
}
