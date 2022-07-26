import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { useValidatorsStore } from '@/store/validators.store';
import { Validator } from '@/models/store/validator';
import { createValidatorsResponseData, expectEmptyValidators, expectValidators } from '../utils/validator.blockchain.data.util';
import { createErrorResponse } from '../utils/common.blockchain.data.util';

jest.mock("axios");
const mockedAxios = mockAxios();

describe('validators store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  });

  it('fetches validators - success', async () => {
    const validatorsStore = useValidatorsStore();
    validatorsStore.validators = Array<Validator>(),
    validatorsStore.numberOfActiveValidators= 0;

    const validators = { data: createValidatorsResponseData() };  
    mockedAxios.request.mockResolvedValueOnce(validators);
    await validatorsStore.fetchValidators();
    expectValidators({validators: validatorsStore.validators, numberOfActive: validatorsStore.numberOfActiveValidators });
  });

  it('fetches validators - error', async () => {
    const validatorsStore = useValidatorsStore();
    validatorsStore.validators = Array<Validator>(),
    validatorsStore.numberOfActiveValidators= 0;

    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await validatorsStore.fetchValidators();

    expectEmptyValidators({validators: validatorsStore.validators, numberOfActive: validatorsStore.numberOfActiveValidators });
  });

});
