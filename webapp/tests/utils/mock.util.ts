import apiFactory from "@/api/factory.api";
import axios from "axios";
import { Keplr } from "@keplr-wallet/types";
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { OfflineAminoSigner } from '@cosmjs/amino';
import { OfflineSigner } from '@cosmjs/launchpad';
import { SigningStargateClient, DeliverTxResponse, HttpEndpoint, SigningStargateClientOptions } from "@cosmjs/stargate";

export function mockAxios() {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  apiFactory.setAxiosInstance(mockedAxios);
  return mockedAxios;
}

export function mockKeplr() {
  const mockedKeplrImpl = {
    getOfflineSigner: jest.fn(() => { }),
    experimentalSuggestChain: jest.fn(async () => { }),
    enable: jest.fn(async () => { }),
  } as unknown as Keplr;
  const mockedKeplr = mockedKeplrImpl as jest.Mocked<Keplr>;
  window.keplr = mockedKeplr
  
  const mockedOfflineSignerImpl = {
    getAccounts: jest.fn(() => { }),
  } as unknown as OfflineAminoSigner & OfflineDirectSigner;
  const mockedOfflineSigner = mockedOfflineSignerImpl as jest.Mocked<OfflineAminoSigner & OfflineDirectSigner>;
  mockedKeplr.getOfflineSigner.mockReturnValue(mockedOfflineSigner)
  window.keplr = mockedKeplr
  
  const mockedSigningStargateClientImpl = {
    signAndBroadcast: jest.fn(() => { }),
    disconnect: jest.fn(() => { }),
  } as unknown as SigningStargateClient;
  const mockedSigningStargateClient = mockedSigningStargateClientImpl as jest.Mocked<SigningStargateClient>;
  
  const mockedConnectWithSigner = jest.fn(async (endpoint: string | HttpEndpoint, signer: OfflineSigner, options?: SigningStargateClientOptions): Promise<SigningStargateClient> => { return undefined as unknown as SigningStargateClient })
  mockedConnectWithSigner.mockResolvedValue(mockedSigningStargateClient)
  SigningStargateClient.connectWithSigner = mockedConnectWithSigner as unknown as (endpoint: string | HttpEndpoint, signer: OfflineSigner, options?: SigningStargateClientOptions) => Promise<SigningStargateClient>
  return { mockedOfflineSigner, mockedSigningStargateClient }
}

