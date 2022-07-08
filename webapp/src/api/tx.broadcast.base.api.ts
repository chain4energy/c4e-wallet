import BaseApi from "@/api/base.api";
import { ConnectionType, ConnectionInfo, WalletResponse, WalletResponseCode } from "@/api/wallet.connecton.api";
import { useToast } from 'vue-toastification';
import { StdFee } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import {LocalSpinner} from "@/services/model/localSpinner";
import { LogLevel } from '@/services/logger/log-level';
import { SigningStargateClient, isDeliverTxFailure } from "@cosmjs/stargate";
import { useConfigurationStore } from "@/store/configuration.store";

const toast = useToast();

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
                                  lockScreen: boolean, localSpinner: LocalSpinner | null, skipErrorToast = false): Promise<WalletResponse> {
    this.before(lockScreen, localSpinner);
    try {
      if (!connection.modifiable) {
        return {
          code: WalletResponseCode.NOK,
          error: 'Cannot modify using: ' + connection.connectionType + ' signer'
        }
      }
      const client = await this.createClient(connection.connectionType)
      if (client == undefined) {
        return {
          code: WalletResponseCode.NOK,
          error: 'Cannot get client'
        }
      }
      const response = await client.signAndBroadcast(connection.account, messages, fee, memo);
      if (isDeliverTxFailure(response)) {
        return {
          code: WalletResponseCode.NOK,
          error: 'Tx Error'
        }
      }
      return {
        code: WalletResponseCode.OK,
        error: ''
      }
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Axios Response', JSON.stringify(err));
      const error = err as Error;
      if (!skipErrorToast) {
        toast.error('Error requesting service:' + this.getServiceType());
      }
      return {
        code: WalletResponseCode.NOK,
        error: 'err'
      };
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
