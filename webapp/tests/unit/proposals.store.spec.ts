import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { useProposalsStore } from "@/store/proposals.store";
import { createErrorResponse } from '../utils/common.blockchain.data.util';
import { Proposal } from "@/models/store/proposal";
import { expectEmptyProposals, expectProposals, createProposalsResponseData } from "../utils/proposal.blockchain.data.util";

jest.mock("axios");
const mockedAxios = mockAxios();

describe('proposals store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  });

  it('fetches proposals - success', async () => {
    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>(),
      proposalsStore.numberOfActiveProposals= 0;

    const validators = { data: createProposalsResponseData() };
    mockedAxios.request.mockResolvedValueOnce(validators);
    await proposalsStore.fetchProposals();
    expectProposals({proposals: proposalsStore.proposals, numberOfActive: proposalsStore.numberOfActiveProposals });
  });

  it('fetches proposals - error', async () => {
    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>();
      proposalsStore.numberOfActiveProposals = 0;

    const proposalsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(proposalsError);
    await proposalsStore.fetchProposals();

    expectEmptyProposals({proposals: proposalsStore.proposals, numberOfActive: proposalsStore.numberOfActiveProposals });
  });

});
