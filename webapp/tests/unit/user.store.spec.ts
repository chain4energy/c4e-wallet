import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/user.store';
import { useConfigurationStore } from '@/store/configuration.store';
import { defaultDenom, createErrorResponse } from "../utils/common.blockchain.data.util";
import { createAddressNotExistsErrorResponse, createBaseAccountResponseData, createContinuousVestingAccountResponseData, createSingleBalanceResponseData, expectBaseAccount, expectContinuousVestingAccount, expectDisconnectedAccount, expectNonExistentAccount} from '../utils/account.blockchain.data.util';
import { createDelegatorDelegationsResponseData, createDelegatorUnbondingDelegationsResponseData, expectDelegatorDelegations, expectDelegatorUnbondingDelegations } from '../utils/staking.blockchain.data.util';
import { createRewardsResponseData, expectRewards } from '../utils/distribution.blockchain.data.util';
import { ConnectionInfo, ConnectionType } from '@/api/wallet.connecton.api';
import { expectAddressConnectionInfo, expectDisconnectedConnectionInfo, expectKeplrConnectionInfo } from '../utils/wallet.blockchain.data.util';
import { Rewards, ValidatorRewards } from '@/models/store/distribution';
import { Delegations, UnbondingDelegations } from '@/models/store/staking';
import { mockAxios, mockKeplr } from '../utils/mock.util';
import { AccountData } from '@cosmjs/proto-signing';
import { useSplashStore } from '@/store/splash.store';
import { Account, AccountType, Coin, ContinuousVestingData } from '@/models/store/account';
import { defaultGas, defaultTxErrorResponse, defaultTxSuccessResponse } from '../utils/tx.broadcast.blockchain.data.util';
import { DeliverTxResponse } from '@cosmjs/stargate';

jest.mock("axios");
const mockedAxios = mockAxios();

const { mockedOfflineSigner, mockedSigningStargateClient } = mockKeplr();

const denom = defaultDenom;
const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg';
const accountData: AccountData  = {
  address: address, 
  algo: "secp256k1",
  pubkey: new Uint8Array([12,34]),
}
mockedOfflineSigner.getAccounts.mockResolvedValue([accountData]);

describe('user store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useConfigurationStore().config.stakingDenom = denom;
    useConfigurationStore().config.operationGas = defaultGas;
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  });

  it('connects as address - base account exists', async () => {
    testConnectBaseAccountExists(async () => {await useUserStore().connectAsAddress(address);}, ConnectionType.Address);
  });

  it('connects as address - account does not exist', async () => {
    testConnectAccountDoesNotExist(async () => {await useUserStore().connectAsAddress(address);}, ConnectionType.Address);
  });

  it('connects as address - coninuous vesting account exists', async () => {
    testConnectConinuousVestingAccountExists(async () => {await useUserStore().connectAsAddress(address);}, ConnectionType.Address);
  });

  it('connects as address - account error', async () => {
    testConnectAccountError(async () => {await useUserStore().connectAsAddress(address);});
  });

  it('connects as address - balance error', async () => {
    testConnectBalanceError(async () => {await useUserStore().connectAsAddress(address);});
  });

  it('connects as address - rewards error', async () => {
    testConnectRewardsError(async () => {await useUserStore().connectAsAddress(address);});
  });

  it('connects as address - delegations error', async () => {
    testConnectDelegationsError(async () => {await useUserStore().connectAsAddress(address);});
  });

  it('connects as address - undelegations error', async () => {
    testConnectUndelegationError(async () => {await useUserStore().connectAsAddress(address);});
  });

  it('connects Keplr - base account exists', async () => {
    testConnectBaseAccountExists(async () => {await useUserStore().connectKeplr();}, ConnectionType.Keplr);
  });

  it('connects Keplr - account does not exist', async () => {
    testConnectAccountDoesNotExist(async () => {await useUserStore().connectKeplr();}, ConnectionType.Keplr);
  });

  it('connects Keplr - coninuous vesting account exists', async () => {
    testConnectConinuousVestingAccountExists(async () => {await useUserStore().connectKeplr();}, ConnectionType.Keplr);
  });

  it('connects Keplr - account error', async () => {
    testConnectAccountError(async () => {await useUserStore().connectKeplr();});
  });

  it('connects Keplr - balance error', async () => {
    testConnectBalanceError(async () => {await useUserStore().connectKeplr();});
  });

  it('connects Keplr - rewards error', async () => {
    testConnectRewardsError(async () => {await useUserStore().connectKeplr();});
  });

  it('connects Keplr - delegations error', async () => {
    testConnectDelegationsError(async () => {await useUserStore().connectKeplr();});
  });

  it('connects Keplr - undelegations error', async () => {
    testConnectUndelegationError(async () => {await useUserStore().connectKeplr();});
  });

  it('connects Keplr - Keplr not installed', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    const account = { data: createBaseAccountResponseData(address) };
    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(account);
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    const keplr = window.keplr;
    window.keplr = undefined;
    try {
      await useUserStore().connectKeplr();
      expectDisconnected();
    } finally {
      window.keplr = keplr;
    }
  });

  it('connects Keplr - Error connecting Keplr', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    const account = { data: createBaseAccountResponseData(address) };
    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(account);
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    mockedOfflineSigner.getAccounts.mockRejectedValueOnce(new Error('Test Error'));

    await useUserStore().connectKeplr();
    expectDisconnected();

  });

  it('delegates - success', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);

    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxSuccessResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.delegate('validator', '12321');

    expectConnectionType(ConnectionType.Keplr);
    expect(userStore.getConnectionType).toBe(ConnectionType.Keplr);
    expectBaseAccount(userStore.getAccount, address);
    expect(userStore.getBalance).toBe(Number(balanceAmount));
    expectRewards(userStore.getRewards);
    expectDelegatorDelegations(userStore.getDelegations);
    expect(userStore.getUndelegations).toStrictEqual(new UnbondingDelegations());
    expect(userStore.isLoggedIn).toBe(true);
    expect(userStore.getVestingLockAmount).toBe(0);
    expect(userStore.getTotalRewards).toBe(userStore.rewards.totalRewards);
    expect(userStore.getTotalDelegated).toBe(userStore.delegations.totalDelegated);
    expect(userStore.getTotalUndelegating).toBe(0);
    expect(userStore.isContinuousVestingAccount).toBe(false);

  });

  it('delegates - tx deliver failure', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);

    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxErrorResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.delegate('validator', '12321');

    expectTxDeliverFailureBaseAccount(balanceAmount, ConnectionType.Keplr)

  });

  it('redelegates - success', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);

    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxSuccessResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.redelegate('validator1', 'validator2', '12321');

    expectConnectionType(ConnectionType.Keplr);
    expect(userStore.getConnectionType).toBe(ConnectionType.Keplr);
    expectBaseAccount(userStore.getAccount, address);
    expect(userStore.getBalance).toBe(Number(balanceAmount));
    expectRewards(userStore.getRewards);
    expectDelegatorDelegations(userStore.getDelegations);
    expect(userStore.getUndelegations).toStrictEqual(new UnbondingDelegations());
    expect(userStore.isLoggedIn).toBe(true);
    expect(userStore.getVestingLockAmount).toBe(0);
    expect(userStore.getTotalRewards).toBe(userStore.rewards.totalRewards);
    expect(userStore.getTotalDelegated).toBe(userStore.delegations.totalDelegated);
    expect(userStore.getTotalUndelegating).toBe(0);
    expect(userStore.isContinuousVestingAccount).toBe(false);

  });

  it('redelegates - tx deliver failure', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);

    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxErrorResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.redelegate('validator', 'validator2', '12321');

    expectTxDeliverFailureBaseAccount(balanceAmount, ConnectionType.Keplr)

  });

  it('undelegates - success', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);

    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxSuccessResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.undelegate('validator1', '12321');

    expectConnectionType(ConnectionType.Keplr);
    expect(userStore.getConnectionType).toBe(ConnectionType.Keplr);
    expectBaseAccount(userStore.getAccount, address);
    expect(userStore.getBalance).toBe(Number(balanceAmount));
    expectRewards(userStore.getRewards);
    expectDelegatorDelegations(userStore.getDelegations);
    expectDelegatorUnbondingDelegations(userStore.getUndelegations);
    expect(userStore.isLoggedIn).toBe(true);
    expect(userStore.getVestingLockAmount).toBe(0);
    expect(userStore.getTotalRewards).toBe(userStore.rewards.totalRewards);
    expect(userStore.getTotalDelegated).toBe(userStore.delegations.totalDelegated);
    expect(userStore.getTotalUndelegating).toBe(userStore.undelegations.totalUndelegating);
    expect(userStore.isContinuousVestingAccount).toBe(false);

  });

  it('undelegates - tx deliver failure', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);

    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxErrorResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.undelegate('validator', '12321');

    expectTxDeliverFailureBaseAccount(balanceAmount, ConnectionType.Keplr)

  });

  it('claims rewards - success', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);
    const initialRewards = new Map<string, ValidatorRewards>();
    initialRewards.set('v1', new ValidatorRewards('v1', [new Coin('0', 'coin')]));
    userStore.rewards = new Rewards(initialRewards, 0);
    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxSuccessResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.claimRewards();

    expectConnectionType(ConnectionType.Keplr);
    expect(userStore.getConnectionType).toBe(ConnectionType.Keplr);
    expectBaseAccount(userStore.getAccount, address);
    expect(userStore.getBalance).toBe(Number(balanceAmount));
    expectRewards(userStore.getRewards);
    expect(userStore.getDelegations).toStrictEqual(new Delegations());
    expect(userStore.getUndelegations).toStrictEqual(new UnbondingDelegations());
    expect(userStore.isLoggedIn).toBe(true);
    expect(userStore.getVestingLockAmount).toBe(0);
    expect(userStore.getTotalRewards).toBe(userStore.rewards.totalRewards);
    expect(userStore.getTotalDelegated).toBe(0);
    expect(userStore.getTotalUndelegating).toBe(0);
    expect(userStore.isContinuousVestingAccount).toBe(false);

  });

  it('claims rewards - tx deliver failure', async () => {
    const balanceAmount = '49031887606805'
    const userStore = useUserStore();
    userStore.logOut();
    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address);
    const initialRewardsMap = new Map<string, ValidatorRewards>();
    initialRewardsMap.set('v1', new ValidatorRewards('v1', [new Coin('0', 'coin')]));
    const initialRewards = new Rewards(initialRewardsMap, 0);
    userStore.rewards = initialRewards;

    const signAndBroadcastMock = async (): Promise<DeliverTxResponse> => {
      return defaultTxErrorResponse;
    };
    mockedSigningStargateClient.signAndBroadcast.mockImplementation(signAndBroadcastMock);

    const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
    const rewards = { data: createRewardsResponseData() };
    const delegations = { data: createDelegatorDelegationsResponseData(address) };
    const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };
  
    mockedAxios.request.mockResolvedValueOnce(balance);
    mockedAxios.request.mockResolvedValueOnce(rewards);
    mockedAxios.request.mockResolvedValueOnce(delegations);
    mockedAxios.request.mockResolvedValueOnce(undelegations);

    await userStore.claimRewards();

    expectTxDeliverFailureBaseAccount(balanceAmount, ConnectionType.Keplr, initialRewards);

  });

  it('calculates locked vesting - ContinuousVestingAccount', async () => {
    const userStore = useUserStore();
    userStore.logOut();

    const currentDate = new Date();
    const startTime = currentDate.getTime();
    const yearInMillis = 365*24*3600*1000;
    const endTime = startTime + yearInMillis;
    const amount = 1000000
    const origVesting = new Coin(amount.toString(), defaultDenom);
    const vestingData = new ContinuousVestingData(startTime.toString(), endTime.toString(), [origVesting]);

    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.ContinuousVestingAccount, address, vestingData);
    
    userStore.calculateVestingLocked(new Date(startTime-1000000).toISOString());
    expect(userStore.getVestingLockAmount).toBe(amount);

    userStore.calculateVestingLocked(new Date(startTime).toISOString())
    expect(userStore.getVestingLockAmount).toBe(amount);

    userStore.calculateVestingLocked(new Date(startTime+yearInMillis/4).toISOString())
    expect(userStore.getVestingLockAmount).toBe(amount - amount/4);

    userStore.calculateVestingLocked(new Date(startTime+yearInMillis/2).toISOString())
    expect(userStore.getVestingLockAmount).toBe(amount/2);

    userStore.calculateVestingLocked(new Date(startTime+yearInMillis-yearInMillis/4).toISOString())
    expect(userStore.getVestingLockAmount).toBe(amount/4);

    userStore.calculateVestingLocked(new Date(endTime).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

    userStore.calculateVestingLocked(new Date(endTime+1000000).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

  });

  it('calculates locked vesting - no ContinuousVestingAccount', async () => {
    const userStore = useUserStore();
    userStore.logOut();

    const currentDate = new Date();
    const startTime = currentDate.getTime();
    const yearInMillis = 365*24*3600*1000;
    const endTime = startTime + yearInMillis;
    const amount = 1000000
    const origVesting = new Coin(amount.toString(), defaultDenom);
    const vestingData = new ContinuousVestingData(startTime.toString(), endTime.toString(), [origVesting]);

    userStore.connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    userStore.account = new Account(AccountType.BaseAccount, address, vestingData);
    
    userStore.calculateVestingLocked(new Date(startTime-1000000).toISOString());
    expect(userStore.getVestingLockAmount).toBe(0);

    userStore.calculateVestingLocked(new Date(startTime).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

    userStore.calculateVestingLocked(new Date(startTime+yearInMillis/4).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

    userStore.calculateVestingLocked(new Date(startTime+yearInMillis/2).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

    userStore.calculateVestingLocked(new Date(startTime+yearInMillis-yearInMillis/4).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

    userStore.calculateVestingLocked(new Date(endTime).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

    userStore.calculateVestingLocked(new Date(endTime+1000000).toISOString())
    expect(userStore.getVestingLockAmount).toBe(0);

  });

  // TODO voting tests

  // TODO Tx actions with rerfershng errors
});

async function testConnectBaseAccountExists(connect: () => Promise<void>, expectedConnectionType: ConnectionType) {

  const balanceAmount = '49031887606805'
  const userStore = useUserStore();
  userStore.logOut();
  const account = { data: createBaseAccountResponseData(address) };
  const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
  const rewards = { data: createRewardsResponseData() };
  const delegations = { data: createDelegatorDelegationsResponseData(address) };
  const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };

  mockedAxios.request.mockResolvedValueOnce(account);
  mockedAxios.request.mockResolvedValueOnce(balance);
  mockedAxios.request.mockResolvedValueOnce(rewards);
  mockedAxios.request.mockResolvedValueOnce(delegations);
  mockedAxios.request.mockResolvedValueOnce(undelegations);

  await connect();

  expectConnectedBaseAccount(balanceAmount, expectedConnectionType);
}

async function testConnectAccountDoesNotExist(connect: () => Promise<void>, expectedConnectionType: ConnectionType) {

  const userStore = useUserStore();
  userStore.logOut();

  const accountError = createAddressNotExistsErrorResponse();

  mockedAxios.request.mockRejectedValue(accountError);
  await connect();

  expectConnectedNonexistent(expectedConnectionType);
}

async function testConnectConinuousVestingAccountExists(connect: () => Promise<void>, expectedConnectionType: ConnectionType) {

  const balanceAmount = '49031887606805'
  const userStore = useUserStore();
  userStore.logOut();
  const account = { data: createContinuousVestingAccountResponseData(address) };
  const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
  const rewards = { data: createRewardsResponseData() };
  const delegations = { data: createDelegatorDelegationsResponseData(address) };
  const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };

  mockedAxios.request.mockResolvedValueOnce(account);
  mockedAxios.request.mockResolvedValueOnce(balance);
  mockedAxios.request.mockResolvedValueOnce(rewards);
  mockedAxios.request.mockResolvedValueOnce(delegations);
  mockedAxios.request.mockResolvedValueOnce(undelegations);

  await connect();

  expectConnectedContinuousVestingAccount(balanceAmount, expectedConnectionType);
}

async function testConnectAccountError(connect: () => Promise<void>) {

  const userStore = useUserStore();
  userStore.logOut();

  const accountError = createErrorResponse(404, 5, 'some error');

  mockedAxios.request.mockRejectedValue(accountError);
  await connect();

  expectDisconnected();

}

async function testConnectBalanceError(connect: () => Promise<void>) {

  const userStore = useUserStore();
  userStore.logOut();

  const account = { data: createBaseAccountResponseData(address) };
  // const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
  const balanceError = createErrorResponse(404, 5, 'some error');
  const rewards = { data: createRewardsResponseData() };
  const delegations = { data: createDelegatorDelegationsResponseData(address) };
  const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };

  mockedAxios.request.mockResolvedValueOnce(account);
  mockedAxios.request.mockRejectedValueOnce(balanceError);
  mockedAxios.request.mockResolvedValueOnce(rewards);
  mockedAxios.request.mockResolvedValueOnce(delegations);
  mockedAxios.request.mockResolvedValueOnce(undelegations);

  await connect();

  expectDisconnected();

}

async function testConnectRewardsError(connect: () => Promise<void>) {

  const userStore = useUserStore();
  userStore.logOut();
  const balanceAmount = '49031887606805'

  const account = { data: createBaseAccountResponseData(address) };
  const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
  const rewardsError = createErrorResponse(404, 5, 'some error');
  // const rewards = { data: createRewardsResponseData() };
  const delegations = { data: createDelegatorDelegationsResponseData(address) };
  const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };

  mockedAxios.request.mockResolvedValueOnce(account);
  mockedAxios.request.mockResolvedValueOnce(balance);
  mockedAxios.request.mockRejectedValueOnce(rewardsError);
  mockedAxios.request.mockResolvedValueOnce(delegations);
  mockedAxios.request.mockResolvedValueOnce(undelegations);

  await connect();

  expectDisconnected();

}

async function testConnectDelegationsError(connect: () => Promise<void>) {

  const userStore = useUserStore();
  userStore.logOut();
  const balanceAmount = '49031887606805'

  const account = { data: createBaseAccountResponseData(address) };
  const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
  const rewards = { data: createRewardsResponseData() };
  const delegationsError = createErrorResponse(404, 5, 'some error');
  // const delegations = { data: createDelegatorDelegationsResponseData(address) };
  const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };

  mockedAxios.request.mockResolvedValueOnce(account);
  mockedAxios.request.mockResolvedValueOnce(balance);
  mockedAxios.request.mockResolvedValueOnce(rewards);
  mockedAxios.request.mockRejectedValueOnce(delegationsError);
  mockedAxios.request.mockResolvedValueOnce(undelegations);

  await connect();

  expectDisconnected();

}

async function testConnectUndelegationError(connect: () => Promise<void>) {

  const userStore = useUserStore();
  userStore.logOut();
  const balanceAmount = '49031887606805'

  const account = { data: createBaseAccountResponseData(address) };
  const balance = { data: createSingleBalanceResponseData(denom, balanceAmount) };
  const rewards = { data: createRewardsResponseData() };
  const delegations = { data: createDelegatorDelegationsResponseData(address) };
  const undelegationsError = createErrorResponse(404, 5, 'some error');

  // const undelegations = { data: createDelegatorUnbondingDelegationsResponseData(address) };

  mockedAxios.request.mockResolvedValueOnce(account);
  mockedAxios.request.mockResolvedValueOnce(balance);
  mockedAxios.request.mockResolvedValueOnce(rewards);
  mockedAxios.request.mockResolvedValueOnce(delegations);
  mockedAxios.request.mockRejectedValueOnce(undelegationsError);

  await connect();

  expectDisconnected();

}

function expectConnectionType(connectionType: ConnectionType) {
  const userStore = useUserStore();
  switch(connectionType) {
    case(ConnectionType.Address): {
      expectAddressConnectionInfo(userStore.connectionInfo, address);
      break;
    }
    case(ConnectionType.Keplr): {
      expectKeplrConnectionInfo(userStore.connectionInfo, address);
      break;
    }
    case(ConnectionType.Disconnected): {
      expectDisconnectedConnectionInfo(userStore.connectionInfo);
      break;
    }
  }
}

function expectTxDeliverFailureBaseAccount(expectedBalanceAmount: string, expectedConnectionType: ConnectionType, expectedRewards = new Rewards()) {
  const userStore = useUserStore();
  expectConnectionType(expectedConnectionType);
  expect(userStore.getConnectionType).toBe(expectedConnectionType);
  expectBaseAccount(userStore.getAccount, address);
  expect(userStore.getBalance).toBe(Number(expectedBalanceAmount));
  expect(userStore.getRewards).toStrictEqual(expectedRewards);
  expect(userStore.getDelegations).toStrictEqual(new Delegations());
  expect(userStore.getUndelegations).toStrictEqual(new UnbondingDelegations());
  expect(userStore.isLoggedIn).toBe(true);
  expect(userStore.getVestingLockAmount).toBe(0);
  expect(userStore.getTotalRewards).toBe(0);
  expect(userStore.getTotalDelegated).toBe(0);
  expect(userStore.getTotalUndelegating).toBe(0);
  expect(userStore.isContinuousVestingAccount).toBe(false);
}

function expectDisconnected() {
  const userStore = useUserStore();
  expectDisconnectedConnectionInfo(userStore.connectionInfo);
  expect(userStore.getConnectionType).toBe(ConnectionType.Disconnected);
  expectDisconnectedAccount(userStore.getAccount);
  expect(userStore.getBalance).toBe(0);
  expect(userStore.getRewards).toStrictEqual(new Rewards());
  expect(userStore.getDelegations).toStrictEqual(new Delegations());
  expect(userStore.getUndelegations).toStrictEqual(new UnbondingDelegations());
  expect(userStore.isLoggedIn).toBe(false);
  expect(userStore.getVestingLockAmount).toBe(0);
  expect(userStore.getTotalRewards).toBe(0);
  expect(userStore.getTotalDelegated).toBe(0);
  expect(userStore.getTotalUndelegating).toBe(0);
  expect(userStore.isContinuousVestingAccount).toBe(false);
}

function expectConnectedBaseAccount(balanceAmount: string, connectionType: ConnectionType) {
  const userStore = useUserStore();
  expectConnectionType(connectionType);
  expect(userStore.getConnectionType).toBe(connectionType);
  expectBaseAccount(userStore.getAccount, address);
  expect(userStore.getBalance).toBe(Number(balanceAmount));
  expectRewards(userStore.getRewards);
  expectDelegatorDelegations(userStore.getDelegations);
  expectDelegatorUnbondingDelegations(userStore.getUndelegations);
  expect(userStore.isLoggedIn).toBe(true);
  expect(userStore.getVestingLockAmount).toBe(0);
  expect(userStore.getTotalRewards).toBe(userStore.rewards.totalRewards);
  expect(userStore.getTotalDelegated).toBe(userStore.delegations.totalDelegated);
  expect(userStore.getTotalUndelegating).toBe(userStore.undelegations.totalUndelegating);
  expect(userStore.isContinuousVestingAccount).toBe(false);
}


function expectConnectedNonexistent(connectionType: ConnectionType) {
  const userStore = useUserStore();
  expectConnectionType(connectionType);
  expect(userStore.getConnectionType).toBe(connectionType);
  expectNonExistentAccount(userStore.getAccount, address);
  expect(userStore.getBalance).toBe(0);
  expect(userStore.getRewards).toStrictEqual(new Rewards());
  expect(userStore.getDelegations).toStrictEqual(new Delegations());

  expect(userStore.getUndelegations).toStrictEqual(new UnbondingDelegations());
  expect(userStore.isLoggedIn).toBe(true);
  expect(userStore.getVestingLockAmount).toBe(0);
  expect(userStore.getTotalRewards).toBe(0);
  expect(userStore.getTotalDelegated).toBe(0);
  expect(userStore.getTotalUndelegating).toBe(0);
  expect(userStore.isContinuousVestingAccount).toBe(false);
}

function expectConnectedContinuousVestingAccount(balanceAmount: string, connectionType: ConnectionType) {
  const userStore = useUserStore();
  expectConnectionType(connectionType);
  expect(userStore.getConnectionType).toBe(connectionType);
  expectContinuousVestingAccount(userStore.getAccount, address);
  expect(userStore.getBalance).toBe(Number(balanceAmount));
  expectRewards(userStore.getRewards);
  expectDelegatorDelegations(userStore.getDelegations);
  expectDelegatorUnbondingDelegations(userStore.getUndelegations);
  expect(userStore.isLoggedIn).toBe(true);
  expect(userStore.getVestingLockAmount).toBe(0);
  expect(userStore.getTotalRewards).toBe(userStore.rewards.totalRewards);
  expect(userStore.getTotalDelegated).toBe(userStore.delegations.totalDelegated);
  expect(userStore.getTotalUndelegating).toBe(userStore.undelegations.totalUndelegating);
  expect(userStore.isContinuousVestingAccount).toBe(true);
}