import { setActivePinia, createPinia } from 'pinia'
import { AxiosResponse } from 'axios';
import apiFactory from "@/api/factory.api";
import { axiosErrorMessagePrefix, createAxiosError, createErrorResponseData, defaultAxiosErrorName } from '../utils/common.blockchain.data.util';
import { createValidators, createValidatorsResponseData, defaultValidators, expectValidator, expectValidators, findNumberOfActiveValidators } from '../utils/validator.blockchain.data.util';
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';

jest.mock("axios");
const mockedAxios = mockAxios();
// const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = apiFactory.validatorsApi()
// apiFactory.setAxiosInstance(mockedAxios)

describe('account api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  })

  it('gets validators - validators exist', async () => {
    const validators = {
      data: createValidatorsResponseData()
    };

    mockedAxios.request.mockResolvedValue(validators);
    const result = await api.fetchAllValidators()
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectValidators(result.data);

  });

  it('gets validators - no validators', async () => {
    const validators = {
      data: createValidatorsResponseData(new Array(), new Array())
    };

    mockedAxios.request.mockResolvedValue(validators);
    const result = await api.fetchAllValidators()
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data?.validators.length).toBe(0);
    expect(result.data?.numberOfActive).toBe(0);
  });

  it('gets validators paginated', async () => {
    const validatorsAddresses1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const params1 = [
      {jailed: false, status: "BOND_STATUS_BONDED", tokens: "113022978544", commission_rate: "0.100000000000000000"},
      {jailed: false, status: "BOND_STATUS_UNBONDED", tokens: "123022978544", commission_rate: "0.110000000000000000"},
      {jailed: false, status: "BOND_STATUS_UNBONDING", tokens: "133022978544", commission_rate: "0.120000000000000000"},
    ];

    const validatorsAddresses2 = [
      'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
      'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
      'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
    ];
    const params2 = [
      {jailed: true, status: "BOND_STATUS_UNBONDED", tokens: "143022978544", commission_rate: "0.130000000000000000"},
      {jailed: true, status: "BOND_STATUS_UNBONDING", tokens: "153022978544", commission_rate: "0.140000000000000000"},
      {jailed: false, status: "BOND_STATUS_BONDED", tokens: "163022978544", commission_rate: "0.150000000000000000"},
    ];

    const validatorsAddressesAll = validatorsAddresses1.concat(validatorsAddresses2)
    const paramsAll = params1.concat(params2)

    const validators1 = {
      data: createValidatorsResponseData(validatorsAddresses1, params1, 0, 6, 'my_key')
    };
    const validators2 = {
      data: createValidatorsResponseData(validatorsAddresses2, params2, 3)
    };

    mockedAxios.request.mockResolvedValueOnce(validators1);
    mockedAxios.request.mockResolvedValueOnce(validators2);

    const result = await api.fetchAllValidators()
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectValidators(result.data, true, validatorsAddressesAll, paramsAll);

  });

  it('gets validators with error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    mockedAxios.request.mockRejectedValue(error);
    const result = await api.fetchAllValidators()
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets delegator delegations paginated with error', async () => {
    const validatorsAddresses1 = [
      'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
      'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
      'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
    ];
    const params1 = [
      {jailed: false, status: "BOND_STATUS_BONDED", tokens: "113022978544", commission_rate: "0.100000000000000000"},
      {jailed: false, status: "BOND_STATUS_UNBONDED", tokens: "123022978544", commission_rate: "0.110000000000000000"},
      {jailed: false, status: "BOND_STATUS_UNBONDING", tokens: "133022978544", commission_rate: "0.120000000000000000"},
    ];

    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';
    const axiosErrorMessage = axiosErrorMessagePrefix + '400';

    const response = {
      data: createErrorResponseData(3, errorMessage),
      status: 400,
      statusText: '',
    };
    const error = createAxiosError(axiosErrorMessage, response as AxiosResponse);

    const validators1 = {
      data: createValidatorsResponseData(validatorsAddresses1, params1, 0, 6, 'my_key')
    };

    mockedAxios.request.mockResolvedValueOnce(validators1);
    mockedAxios.request.mockRejectedValue(error);

    const result = await api.fetchAllValidators()
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessage);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);
  });

});



