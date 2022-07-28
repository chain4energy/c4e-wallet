import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { useProposalsStore } from "@/store/proposals.store";
import { createErrorResponse } from '../utils/common.blockchain.data.util';
import { Proposal } from "@/models/store/proposal";
import { expectEmptyProposals, expectProposals, createProposalsResponseData, createTallyParamsResponseData, expectTallyParams } from "../utils/proposal.blockchain.data.util";

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

  it('fetches tally params - success', async () => {
    const quorum = 0.23432;
    const threshold = 0.987;
    const vetoThreshold = 0.3678
    const tally = {
      data: createTallyParamsResponseData(quorum.toString(), threshold.toString(), vetoThreshold.toString())
    };
    mockedAxios.request.mockResolvedValueOnce(tally);
    await useProposalsStore().fetchTallyParams();
    expectTallyParams(useProposalsStore().getTallyParams, quorum, threshold, vetoThreshold);
  });

  it('fetches tally params - error', async () => {
    const proposalsStore = useProposalsStore();

    const tallyError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(tallyError);
    await proposalsStore.fetchTallyParams();

    expectTallyParams(useProposalsStore().getTallyParams, Number.NaN, Number.NaN, Number.NaN);
  });

});
