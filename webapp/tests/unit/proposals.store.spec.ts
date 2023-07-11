import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { useProposalsStore } from "@/store/proposals.store";
import { createErrorResponse, defaultDenom, expectCoin } from '../utils/common.blockchain.data.util';
import { Proposal, VoteOption } from "@/models/store/proposal";
import {
  defaultProposals,
  expectEmptyProposals,
  expectProposals,
  createProposalsResponseData,
  createTallyParamsResponseData,
  expectTallyParams,
  createDepositParamsResponseData,
  createProposalTallyResponse,
  expectTallyResult,
  createYesProposalUserVoteResponse,
  createProposalResponseData,
  expectProposal,
  createProposalDetailsTally
} from "../utils/proposal.blockchain.data.util";
import { useConfigurationStore } from '@/store/configuration.store';
import { useUserStore } from '@/store/user.store';
import { ConnectionInfo, ConnectionType } from '@/api/wallet.connecton.api';
import { Account, AccountType } from '@/models/store/account';

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    })),
    request: jest.fn(),
    AxiosError: jest.fn()
  }
})
const mockedAxios = mockAxios();

describe('proposals store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = defaultDenom;
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  });

  it('fetches proposals - success', async () => {
    let tallyStore = useProposalsStore().proposalsTally.get(1);
    expect(tallyStore).toBeUndefined();
    expect(useProposalsStore().proposalTally).toBeUndefined();

    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>(),
    proposalsStore.numberOfActiveProposals= 0;

    const validators = { data: createProposalsResponseData() };

    const yes = 123n;
    const abstain = 12334n;
    const no = 43850834075n;
    const noWithVeto = 19283012073n;
    const bondedTokens = yes+no+abstain+noWithVeto+29283012073n;
    const notBondedTokens = 29283012073n;
    const tally = {
      data: createProposalTallyResponse(yes.toString(), abstain.toString(), no.toString(), noWithVeto.toString())
    };

    const proposalDetailsTally = { data: createProposalDetailsTally(
        [{id: 1, yes: yes, no: no, abstain: abstain, noWithVeto: noWithVeto, bondedTokens: bondedTokens, notBondedTokens: notBondedTokens}]
      )};

    mockedAxios.request.mockResolvedValueOnce(validators);
    mockedAxios.request.mockResolvedValueOnce(proposalDetailsTally);
    mockedAxios.request.mockResolvedValueOnce(tally);
    await proposalsStore.fetchProposals();


    expectProposals({proposals: proposalsStore.proposals, numberOfActive: proposalsStore.numberOfActiveProposals });

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(1);
    tallyStore = useProposalsStore().proposalsTally.get(Number(defaultProposals[5]));
    expect(tallyStore).not.toBeUndefined();
    expectTallyResult(tallyStore, yes, abstain, no, noWithVeto);
    expect(useProposalsStore().proposalTally).toBeUndefined();

  });

  it('fetches proposals - success but no voting tally', async () => {
    let tallyStore = useProposalsStore().proposalsTally.get(1);
    expect(tallyStore).toBeUndefined();
    expect(useProposalsStore().proposalTally).toBeUndefined();

    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>(),
    proposalsStore.numberOfActiveProposals= 0;

    const validators = { data: createProposalsResponseData() };

    mockedAxios.request.mockResolvedValueOnce(validators);

    await proposalsStore.fetchProposals();


    expectProposals({proposals: proposalsStore.proposals, numberOfActive: proposalsStore.numberOfActiveProposals });

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(0);
    tallyStore = useProposalsStore().proposalsTally.get(Number(defaultProposals[5]));
    expect(tallyStore).toBeUndefined();
    expect(useProposalsStore().proposalTally).toBeUndefined();

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






  it('fetches deposit params - success', async () => {
    const amount = 1234n;

    const tally = {
      data: createDepositParamsResponseData(amount.toString(), defaultDenom)
    };
    mockedAxios.request.mockResolvedValueOnce(tally);
    await useProposalsStore().fetchDepositParams();
    expectCoin(useProposalsStore().getMinDeposit, amount, defaultDenom);
  });

  it('fetches deposit params - error', async () => {
    const proposalsStore = useProposalsStore();

    const tallyError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(tallyError);
    await proposalsStore.fetchDepositParams();

    expectCoin(useProposalsStore().getMinDeposit, 0n, defaultDenom);
  });


  it('fetches tally result - success to map', async () => {

    let tallyStore = useProposalsStore().proposalsTally.get(1);
    expect(tallyStore).toBeUndefined();
    expect(useProposalsStore().proposalTally).toBeUndefined();

    const yes = 123n;
    const abstain = 12334n;
    const no = 43850834075n;
    const noWithVeto = 19283012073n;

    const tally = {
      data: createProposalTallyResponse(yes.toString(), abstain.toString(), no.toString(), noWithVeto.toString())
    };
    mockedAxios.request.mockResolvedValueOnce(tally);
    await useProposalsStore().fetchVotingProposalTallyResult(1, false);

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(1);
    tallyStore = useProposalsStore().proposalsTally.get(1);
    expect(tallyStore).not.toBeUndefined();
    expectTallyResult(tallyStore, yes, abstain, no, noWithVeto);
    expect(useProposalsStore().proposalTally).toBeUndefined();


  });

  it('fetches tally result - success to single', async () => {
    let tallyStore = useProposalsStore().proposalsTally.get(1);
    expect(tallyStore).toBeUndefined();
    expect(useProposalsStore().proposalTally).toBeUndefined();

    const yes = 123n;
    const abstain = 12334n;
    const no = 43850834075n;
    const noWithVeto = 19283012073n;

    const tally = {
      data: createProposalTallyResponse(yes.toString(), abstain.toString(), no.toString(), noWithVeto.toString())
    };
    mockedAxios.request.mockResolvedValueOnce(tally);
    await useProposalsStore().fetchVotingProposalTallyResult(1, true);

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(1);
    tallyStore = useProposalsStore().proposalsTally.get(1);
    expect(tallyStore).not.toBeUndefined();
    expect(useProposalsStore().proposalTally).not.toBeUndefined();
    expectTallyResult(useProposalsStore().proposalTally, yes, abstain, no, noWithVeto);

  });

  it('fetches tally result - error', async () => {
    const proposalsStore = useProposalsStore();

    const tallyError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(tallyError);
    await proposalsStore.fetchVotingProposalTallyResult(1, false);

    expectCoin(useProposalsStore().getMinDeposit, 0n, defaultDenom);
  });

  it('fetches user vote - success to single', async () => {
    expect(useProposalsStore().userVote).toBeNull();
    const vote = {
      data: createYesProposalUserVoteResponse()
    };
    mockedAxios.request.mockResolvedValueOnce(vote);
    await useProposalsStore().fetchProposalUserVote(2, 'testAddr', false);

    expect(useProposalsStore().userVote).toBe(VoteOption.Yes);

  });

  it('fetches user vote - error', async () => {
    expect(useProposalsStore().userVote).toBeNull();

    const proposalsStore = useProposalsStore();

    const tallyError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(tallyError);
    await proposalsStore.fetchProposalUserVote(2, 'testAddr', false);
    expect(useProposalsStore().userVote).toBeNull();
  });

  it('fetches proposal by id no voiting - success', async () => {
    expect(useProposalsStore().proposalsTally.size).toBe(0);
    expect(useProposalsStore().proposalTally).toBeUndefined();

    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>(),
    proposalsStore.numberOfActiveProposals= 0;

    const proposal = { data: createProposalResponseData() };

    const yes = 123n;
    const abstain = 12334n;
    const no = 43850834075n;
    const noWithVeto = 19283012073n;

    const tally = {
      data: createProposalTallyResponse(yes.toString(), abstain.toString(), no.toString(), noWithVeto.toString())
    };


    mockedAxios.request.mockResolvedValueOnce(proposal);
    mockedAxios.request.mockResolvedValueOnce(tally);

    await proposalsStore.fetchProposalById(Number(defaultProposals[5]), undefined, undefined, false, true);


    expect(proposalsStore.proposals.length).toBe(0);

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(0);
    expect(useProposalsStore().proposalsTally.size).toBe(0);

    expect(useProposalsStore().proposal).not.toBeUndefined();
    const proposalInStore = useProposalsStore().proposal;
    if (proposalInStore) {
      expectProposal(proposalInStore, proposal.data.proposal);
    }
    expect(useProposalsStore().proposalTally).toBeUndefined();
    expect(useProposalsStore().userVote).toBeNull();
  });

  it('fetches proposal by id - voiting - success', async () => {
    expect(useProposalsStore().proposalsTally.size).toBe(0);
    expect(useProposalsStore().proposalTally).toBeUndefined();

    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>(),
    proposalsStore.numberOfActiveProposals= 0;

    const proposal = { data: createProposalResponseData('PROPOSAL_STATUS_VOTING_PERIOD') };

    const yes = 123n;
    const abstain = 12334n;
    const no = 43850834075n;
    const noWithVeto = 19283012073n;

    const tally = {
      data: createProposalTallyResponse(yes.toString(), abstain.toString(), no.toString(), noWithVeto.toString())
    };


    mockedAxios.request.mockResolvedValueOnce(proposal);
    mockedAxios.request.mockResolvedValueOnce(tally);

    await proposalsStore.fetchProposalById(Number(defaultProposals[5]), undefined, undefined, false, true);


    expect(proposalsStore.proposals.length).toBe(0);

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(1);

    expect(useProposalsStore().proposal).not.toBeUndefined();
    const proposalInStore = useProposalsStore().proposal;
    if (proposalInStore) {
      expectProposal(proposalInStore, proposal.data.proposal);
    }
    expect(useProposalsStore().proposalTally).not.toBeUndefined();
    expectTallyResult(useProposalsStore().proposalTally, yes, abstain, no, noWithVeto);
    expect(useProposalsStore().userVote).toBeNull();
  });

  it('fetches proposal by id no voiting - loggedin - success', async () => {
    const address = 'add12345';
    useUserStore().connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    useUserStore().account = new Account(AccountType.BaseAccount, address);
    expect(useProposalsStore().proposalsTally.size).toBe(0);
    expect(useProposalsStore().proposalTally).toBeUndefined();
    expect(useProposalsStore().userVote).toBeNull();

    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>(),
    proposalsStore.numberOfActiveProposals= 0;

    const proposal = { data: createProposalResponseData() };

    const vote = {
      data: createYesProposalUserVoteResponse()
    };

    mockedAxios.request.mockResolvedValueOnce(proposal);
    mockedAxios.request.mockResolvedValueOnce(vote);

    await proposalsStore.fetchProposalById(Number(defaultProposals[5]), undefined, undefined, false, true);
    console.log(useProposalsStore().proposal)

    expect(proposalsStore.proposals.length).toBe(0);

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(0);
    expect(useProposalsStore().proposalsTally.size).toBe(0);

    expect(useProposalsStore().proposal).not.toBeUndefined();
    const proposalInStore = useProposalsStore().proposal;
    if (proposalInStore) {
      expectProposal(proposalInStore, proposal.data.proposal);
    }
    expect(useProposalsStore().proposalTally).toBeUndefined();
    expect(useProposalsStore().userVote).toBe(VoteOption.Yes);
  });

  it('fetches proposal by id - voiting - logged - success', async () => {
    const address = 'add12345';
    useUserStore().connectionInfo = new ConnectionInfo(address, true, ConnectionType.Keplr);
    useUserStore().account = new Account(AccountType.BaseAccount, address);

    expect(useProposalsStore().proposalsTally.size).toBe(0);
    expect(useProposalsStore().proposalTally).toBeUndefined();
    expect(useProposalsStore().userVote).toBeNull();

    const proposalsStore = useProposalsStore();
    proposalsStore.proposals = Array<Proposal>(),
    proposalsStore.numberOfActiveProposals= 0;

    const proposal = { data: createProposalResponseData('PROPOSAL_STATUS_VOTING_PERIOD') };

    const yes = 123n;
    const abstain = 12334n;
    const no = 43850834075n;
    const noWithVeto = 19283012073n;

    const tally = {
      data: createProposalTallyResponse(yes.toString(), abstain.toString(), no.toString(), noWithVeto.toString())
    };


    const vote = {
      data: createYesProposalUserVoteResponse()
    };


    mockedAxios.request.mockResolvedValueOnce(proposal);
    mockedAxios.request.mockResolvedValueOnce(vote);
    mockedAxios.request.mockResolvedValueOnce(tally);


    await proposalsStore.fetchProposalById(Number(defaultProposals[5]), undefined, undefined, false, true);


    expect(proposalsStore.proposals.length).toBe(0);

    expect(useProposalsStore().proposalsTally).not.toBeUndefined();
    expect(useProposalsStore().proposalsTally.size).toBe(1);

    expect(useProposalsStore().proposal).not.toBeUndefined();
    const proposalInStore = useProposalsStore().proposal;
    if (proposalInStore) {
      expectProposal(proposalInStore, proposal.data.proposal);
    }
    expect(useProposalsStore().proposalTally).not.toBeUndefined();
    expectTallyResult(useProposalsStore().proposalTally, yes, abstain, no, noWithVeto);
    expect(useProposalsStore().userVote).toBe(VoteOption.Yes);
  });

});
