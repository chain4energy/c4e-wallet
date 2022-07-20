import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/user.store';
import { useConfigurationStore } from '@/store/configuration.store';
import { defaultDenom } from "../utils/common.blockchain.data.util";
import { createAddressNotExistsErrorResponse, createBaseAccountResponseData, createContinuousVestingAccountResponseData, createErrorResponse, createSingleBalanceResponseData, expectBaseAccount, expectContinuousVestingAccount, expectDisconnectedAccount, expectNonExistentAccount} from '../utils/account.blockchain.data.util';
import { createDelegatorDelegationsResponseData, createDelegatorUnbondingDelegationsResponseData, expectDelegatorDelegations, expectDelegatorUnbondingDelegations } from '../utils/staking.blockchain.data.util';
import { createRewardsResponseData, expectRewards } from '../utils/distribution.blockchain.data.util';
import { ConnectionType } from '@/api/wallet.connecton.api';
import { expectAddressConnectionInfo, expectDisconnectedConnectionInfo, expectKeplrConnectionInfo } from '../utils/wallet.blockchain.data.util';
import { Rewards } from '@/models/store/distribution';
import { Delegations, UnbondingDelegations } from '@/models/store/staking';
import { mockAxios, mockKeplr } from '../utils/mock.util';
import { AccountData } from '@cosmjs/proto-signing';

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

describe('get account', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = denom
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

  // ----
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