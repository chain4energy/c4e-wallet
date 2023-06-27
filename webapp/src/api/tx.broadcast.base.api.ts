import BaseApi from "@/api/base.api";
import {ConnectionInfo, ConnectionType} from "@/api/wallet.connecton.api";
import {useToast} from 'vue-toastification';
import {LocalSpinner} from "@/services/model/localSpinner";
import {LogLevel} from '@/services/logger/log-level';
import {defaultRegistryTypes, DeliverTxResponse, isDeliverTxFailure, SigningStargateClient} from "@cosmjs/stargate";
import {useConfigurationStore} from "@/store/configuration.store";
import {RequestResponse} from '@/models/request-response';
import TxToast from "@/components/commons/TxToast.vue";
import {Keplr} from "@keplr-wallet/types";
import {
  EncodeObject,
  encodePubkey,
  makeAuthInfoBytes,
  makeSignDoc,
  Registry,
  TxBodyEncodeObject
} from '@cosmjs/proto-signing';
import {encodeSecp256k1Pubkey, StdFee, StdSignDoc, makeSignDoc as makeStdSignDoc, makeStdTx } from "@cosmjs/amino";
import {Int53} from "@cosmjs/math"
import {MsgSignData} from "@/types/tx";
import {TxRaw} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {fromBase64} from "@cosmjs/encoding";
import {DataToSign} from "@/models/user/walletAuth";
import {_arrayBufferToBase64} from "@/utils/sign";
import {ethers} from "ethers";
import {AminoMsg} from "@cosmjs/amino/build/signdoc";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";


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
      const isLedger = (await extension?.getKey("")).isNanoLedger;
      const offlineSigner = isLedger ? extension.getOfflineSignerOnlyAmino("") : extension.getOfflineSigner("");
      return {signer: offlineSigner, isLedger: isLedger};
    }
    throw new Error(errorMessage);
  }

  private getMetamaskSigner() {
    const ethereum = window.ethereum;
    const provider = new ethers.providers.Web3Provider(ethereum);
    return provider.getSigner();
  }

  private async getOfflineDirectSignerExtensionBased(extension: Keplr | undefined, errorMessage: string) {
    if(extension) {
      const chainId = useConfigurationStore().config.chainId;
      const isLedger = (await extension?.getKey("")).isNanoLedger;
      const offlineSigner = extension.getOfflineSigner("");
      return {signer: offlineSigner, isLedger: isLedger};
    }
    throw new Error(errorMessage);
  }

  private async getOfflineDirectSigner(connectionType: ConnectionType) {
    switch(connectionType) {
      case ConnectionType.Keplr: {
        return this.getOfflineDirectSignerExtensionBased(window.keplr, 'Keplr not installed');
      }
      case ConnectionType.Cosmostation: {
        return this.getOfflineDirectSignerExtensionBased(window.cosmostation?.providers.keplr, 'Cosmostation not installed');
      }
      case ConnectionType.Leap: {
        return this.getOfflineDirectSignerExtensionBased(window.leap, 'Leap not installed');
      }
      default: {
        throw new Error('No signer for connnection type: ' + connectionType);
      }
    }
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

  private createTxSignErrorResponseWithToast(errorData: TxBroadcastError,toastMessageBeginning: string | undefined, showErrorToast: boolean): RequestResponse<string, TxBroadcastError> {
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
    return new RequestResponse<string, TxBroadcastError>(errorData);
  }

  protected async signDirect(
    connection: ConnectionInfo,
    getMessages: (isLedger: boolean) => readonly EncodeObject[] | TxBroadcastError,
    dataToSign: DataToSign,
    fee: StdFee,
    memo: string,
    lockScreen: boolean, localSpinner: LocalSpinner | null,
    skipErrorToast = false
  ): Promise<RequestResponse<string, TxBroadcastError>>
  {
    this.logToConsole(LogLevel.DEBUG, 'signDirect');
    this.before(lockScreen, localSpinner);
    let clientToDisconnect: SigningStargateClient | undefined;
    try {
      if (!connection.modifiable) {
        return this.createTxSignErrorResponseWithToast(
          new TxBroadcastError('Cannot broadcast transaction with: ' + connection.connectionType + ' signer'),
          'Sign direct error',
          !skipErrorToast
        );
      }
      // const { client, isLedger } = await this.createClient(connection.connectionType);
      // clientToDisconnect = client;
      // if (client === undefined) {
      //   return this.createTxSignErrorResponseWithToast(
      //     new TxBroadcastError('Cannot get signing client'),
      //     'Sign direct error',
      //     !skipErrorToast
      //   );
      // }
      //
      // const messages = getMessages(isLedger);
      // if (messages instanceof TxBroadcastError) {
      //   return new RequestResponse<string, TxBroadcastError>(messages);
      // }

      if (connection.pubKey === undefined) {
        return this.createTxSignErrorResponseWithToast(
          new TxBroadcastError('Cannot get signing client'),
          'Sign direct error',
          !skipErrorToast
        );
      }
      // const pubkey = encodePubkey(encodeSecp256k1Pubkey(connection.pubKey));

      // const txBodyEncodeObject: TxBodyEncodeObject = {
      //   typeUrl: "/cosmos.tx.v1beta1.TxBody",
      //   value: {
      //     messages: messages,
      //     memo: '',
      //   },
      // };

      const myRegistry = new Registry(defaultRegistryTypes);
      const signDataMsgTypeUrl = '/sign.MsgSignData';
      myRegistry.register(signDataMsgTypeUrl, MsgSignData);

      const utf8Encode = new TextEncoder();
      const messageToSign = utf8Encode.encode(dataToSign.randomString);
      // const b64MessageToSign = _arrayBufferToBase64(messageToSign);

      const val: MsgSignData = {
        signer: connection.account,
        data: messageToSign
      };
      const aminoMsg: AminoMsg = {
        type: '/sign.MsgSignData',
        value: val
      };
      const messages2: AminoMsg[] = [
        aminoMsg
      ];
      const sequence = dataToSign.sequenceNumber;
      const accountNumber = dataToSign.accountNumber;
      const encodedMessages: EncodeObject[] = [
        {typeUrl: "/sign.MsgSignData", value: val}
      ];

      console.log(useConfigurationStore().config.chainId)
      const a = await window.cosmostation?.providers.keplr?.signAmino(useConfigurationStore().config.chainId, connection.account, {
          "chain_id": "",
          "account_number": "0",
          "sequence": "0",
          "fee": {
            "gas": "0",
            "amount": []
          },
          "msgs": [
            {
              "type": "sign/MsgSignData",
              "value": {
                "signer": connection.account,
                "data": "SSBhbSB0aGUgb3duZXIgb2YgYzRlMXl5amZkNWNqNW5kMGpybHZyaGM1cDNtbmtjbjh2OXE4ZmRkOWdzLg=="
              }
            }
          ],
          "memo": ""
        }

      );
      console.log(a)


      const signDoc = makeStdSignDoc(messages2, fee, useConfigurationStore().config.chainId, "", accountNumber, sequence);

      const offlineSigner = await this.getOfflineDirectSigner(connection.connectionType);

      const {signature, signed} = await offlineSigner.signer.signAmino(connection.account, signDoc);
      console.log(signature);

      const signedTxBody: TxBodyEncodeObject = {
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: {
          messages: encodedMessages,
          memo: signed.memo
        },
      };
      const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
      const signedTxBodyBytes = myRegistry.encode(signedTxBody);
      const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
      const signedSequence = Int53.fromString(signed.sequence).toNumber();
      const pubkey = encodePubkey(encodeSecp256k1Pubkey(connection.pubKey));
      const signedAuthInfoBytes = makeAuthInfoBytes(
        [{ pubkey, sequence: signedSequence }],
        signed.fee.amount,
        signedGasLimit,
        undefined,
        undefined,
        signMode,
      );
      const txRaw = TxRaw.fromPartial({
        bodyBytes: signedTxBodyBytes,
        authInfoBytes: signedAuthInfoBytes,
        signatures: [fromBase64(signature.signature)],
      });
      const txBytes = TxRaw.encode(txRaw).finish();

      const b64EncodedTxBytes = _arrayBufferToBase64(txBytes);


      // const txBodyBytes = myRegistry.encode(txBodyEncodeObject);
      // const gasLimit = Int53.fromString(fee.gas).toNumber();
      // const sequence = dataToSign.sequenceNumber;
      // const authInfoBytes = makeAuthInfoBytes([{ pubkey, sequence }], fee.amount, gasLimit, undefined, undefined);
      // const accountNumber = dataToSign.accountNumber;
      // const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, useConfigurationStore().config.chainId, accountNumber);
      // const offlineSigner = await this.getOfflineDirectSigner(connection.connectionType);
      //
      // const { signature, signed } = await offlineSigner.signer.signDirect(connection.account, signDoc);
      //
      //
      // const txRaw = TxRaw.fromPartial({
      //   bodyBytes: signed.bodyBytes,
      //   authInfoBytes: signed.authInfoBytes,
      //   signatures: [fromBase64(signature.signature)],
      // });
      // const txBytes = TxRaw.encode(txRaw).finish();
      // console.log("txBytes: " + txBytes);
      // console.log("txBytes size: " + txBytes.length);
      // console.log("txBytes byteLength: " + txBytes.byteLength);
      //
      // const b64EncodedTxBytes = _arrayBufferToBase64(txBytes);

      return new RequestResponse<string, TxBroadcastError>(undefined, b64EncodedTxBytes);
    } catch (err) {
      console.log(err)
      this.logToConsole(LogLevel.ERROR, 'Client Response', this.stringify(err));
      const error = err as Error;
      return this.createTxSignErrorResponseWithToast(
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
  protected async signWithMetamask(
    dataToSign: string,
    lockScreen: boolean, localSpinner: LocalSpinner | null,
    skipErrorToast = false
  ): Promise<RequestResponse<string, TxBroadcastError>>
  {
    this.logToConsole(LogLevel.DEBUG, 'signDirect');
    this.before(lockScreen, localSpinner);
    let clientToDisconnect: SigningStargateClient | undefined;
    try {

      const signer = this.getMetamaskSigner();
      if (signer === undefined) {
        return this.createTxSignErrorResponseWithToast(
          new TxBroadcastError('Cannot get signing client'),
          'Sign direct error',
          !skipErrorToast
        );
      }

      const signature = await signer.signMessage(dataToSign);

      return new RequestResponse<string, TxBroadcastError>(undefined, signature);
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Client Response', this.stringify(err));
      const error = err as Error;
      return this.createTxSignErrorResponseWithToast(
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
  protected async signWithMetamaskPairing(
    dataToSign: string,
    lockScreen: boolean, localSpinner: LocalSpinner | null,
    skipErrorToast = false
  ): Promise<RequestResponse<string, TxBroadcastError>>
  {
    this.logToConsole(LogLevel.DEBUG, 'signDirectPairing');
    this.before(lockScreen, localSpinner);
    let clientToDisconnect: SigningStargateClient | undefined;
    try {

      const signer = this.getMetamaskSigner();
      if (signer === undefined) {
        return this.createTxSignErrorResponseWithToast(
          new TxBroadcastError('Cannot get signing client'),
          'Sign direct error',
          !skipErrorToast
        );
      }

      const signature = await signer.signMessage(dataToSign);

      return new RequestResponse<string, TxBroadcastError>(undefined, signature);
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Client Response', this.stringify(err));
      const error = err as Error;
      return this.createTxSignErrorResponseWithToast(
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

  protected async sendTransactionWithMetamask(
    amount: string,
    blockchainAddress: string,
    coinDecimals: number,
    destinationAddress: string,
    lockScreen: boolean, localSpinner: LocalSpinner | null,
    skipErrorToast = false
  ): Promise<RequestResponse<string, TxBroadcastError>>
  {
    this.logToConsole(LogLevel.DEBUG, 'signDirect');
    this.before(lockScreen, localSpinner);
    let clientToDisconnect: SigningStargateClient | undefined;
    try {


      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(blockchainAddress, this.abi, provider);

      const baseUnitAmount = ethers.utils.parseUnits(amount, coinDecimals);

      const signer = provider.getSigner();

      const transfer = await contract.connect(signer).transfer(destinationAddress, baseUnitAmount);


      return new RequestResponse<string, TxBroadcastError>(undefined, transfer.hash);
    } catch (err) {
      this.logToConsole(LogLevel.ERROR, 'Client Response', this.stringify(err));
      const error = err as Error;
      return this.createTxSignErrorResponseWithToast(
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
  abi = `[
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]`
}
