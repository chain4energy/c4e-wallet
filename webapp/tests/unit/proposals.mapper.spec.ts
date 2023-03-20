import {GovernanceParameters, Proposal as BcProposal, Tally} from "@/models/blockchain/proposals";
import { ProposalVoteResponse } from "@/models/hasura/proposal.vote";
import { mapDepositParams, mapProposal, mapProposalByID, mapProposals, mapProposalTallyResult, mapProposalVoteResponse, mapTallyParams } from "@/models/mapper/proposals.mapper";
import { VoteOption } from "@/models/store/proposal";
import { useConfigurationStore } from "@/store/configuration.store";
import { createPinia, setActivePinia } from "pinia";
import { expectCoin } from "../utils/common.blockchain.data.util";
import {
  createAbstainProposalUserVoteResponse,
  createDepositParamsResponseData,
  createNoProposalUserVoteResponse,
  createProposal,
  createProposals,
  createProposalTallyResult,
  createProposalUserVoteResponse,
  createTallyParamsResponseData,
  createVetoProposalUserVoteResponse,
  createYesProposalUserVoteResponse,
  defaultProposals,
  defaultProposalsParameters,
  expectProposal, expectProposals, expectTallyParams, expectTallyResult
} from "../utils/proposal.blockchain.data.util";

const proposalId = defaultProposals[0];
const proposalParams = defaultProposalsParameters[0];

describe('tests mapping of proposals related data',  () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  });

  it('maps undefined proposal', async ()=> {
    expect(() => {mapProposalByID(undefined)}).toThrow(new Error('Proposal is undefined'));
  });

  // it('map Proposal', async ()=> {
  //   const bcProposal: BcProposal = createProposal();
  //   const storeProposal = mapProposal(bcProposal);
  //   expectProposal(storeProposal, bcProposal);
  // })
  //
  // it('maps undefined proposals', async ()=>{
  //   expect(()=> {mapProposals(undefined)}).toThrowError(new Error('Proposals list is undefined'));
  // });
  // it('maps proposals', async () => {
  //   const bcProposals = createProposals();
  //   const storeProposals = mapProposals(bcProposals);
  //
  //   expectProposals(storeProposals);
  //
  // });

  it('map tally result', async ()=> {
    const yes = 123n;
    const abstain = 12334n;
    const no = 43850834075n;
    const noWithVeto = 19283012073n;
    const tallyResp = createProposalTallyResult(yes.toString(), abstain.toString(), no.toString(), noWithVeto.toString());
    const storeTally = mapProposalTallyResult(tallyResp);
    expectTallyResult(storeTally, yes, abstain, no, noWithVeto);
  })


  it('map tally result - undefined tally params', async ()=> {
    expect(()=> {mapProposalTallyResult(undefined)}).toThrowError(new Error('mapProposalTallyResult -tally is undefined'));
  })

  it('map tally result - no yes', async ()=> {
    const brokenTally = {
      abstain_count: '12334',
      no_count: '43850834075',
      no_with_veto_count: '19283012073',
    } as Tally
    expect(()=> {mapProposalTallyResult(brokenTally)}).toThrowError(new Error('mapProposalTallyResult - some of tally votes is undefined'));

  })

  it('map tally result - no abstain', async ()=> {
    const brokenTally = {
      yes_count: '123',
      no_count: '43850834075',
      no_with_veto_count: '19283012073',
    } as Tally
    expect(()=> {mapProposalTallyResult(brokenTally)}).toThrowError(new Error('mapProposalTallyResult - some of tally votes is undefined'));

  })

  it('map tally result - no no', async ()=> {
    const brokenTally = {
      yes_count: '123',
      abstain_count: '12334',
      no_with_veto_count: '19283012073',
    } as Tally
    expect(()=> {mapProposalTallyResult(brokenTally)}).toThrowError(new Error('mapProposalTallyResult - some of tally votes is undefined'));

  })

  it('map tally result - no no_with_veto', async ()=> {
    const brokenTally = {
      yes_count: '123',
      abstain_count: '12334',
      no_count: '43850834075',
    } as Tally
    expect(()=> {mapProposalTallyResult(brokenTally)}).toThrowError(new Error('mapProposalTallyResult - some of tally votes is undefined'));

  })

  it('map tally params', async ()=> {
    const quorum = 0.23432;
    const threshold = 0.987;
    const vetoThreshold = 0.3678
    const tallyResp = createTallyParamsResponseData(quorum.toString(), threshold.toString(), vetoThreshold.toString());
    const storeTally = mapTallyParams(tallyResp);
    expectTallyParams(storeTally, quorum, threshold, vetoThreshold);
  })

  it('map tally params - undefined gov params', async ()=> {
    expect(()=> {mapTallyParams(undefined)}).toThrowError(new Error('mapTallyParams - governanceParams is undefined'));

  })

  it('map tally params - undefined tally params', async ()=> {
    expect(()=> {mapTallyParams({} as GovernanceParameters)}).toThrowError(new Error('mapTallyParams - tally params is undefined'));

  })

  it('map tally params - undefined quorum', async ()=> {
    expect(()=> {mapTallyParams({tally_params : {threshold: '2321', veto_threshold: '1132'}} as GovernanceParameters)}).toThrowError(new Error('mapTallyParams - quorum or threshold or vetothreshold is undefined'));

  })

  it('map tally params - undefined threshold', async ()=> {
    expect(()=> {mapTallyParams({tally_params : {quorum: '2321', veto_threshold: '1132'}} as GovernanceParameters)}).toThrowError(new Error('mapTallyParams - quorum or threshold or vetothreshold is undefined'));

  })

  it('map tally params - undefined veto threshold', async ()=> {
    expect(()=> {mapTallyParams({tally_params : {quorum: '2321', threshold: '1132'}} as GovernanceParameters)}).toThrowError(new Error('mapTallyParams - quorum or threshold or vetothreshold is undefined'));

  })

  it('map deposit params', async ()=> {
    const amount = 1234n;
    const denom = 'my_denom';
    useConfigurationStore().config.stakingDenom = denom;
    const deposit = createDepositParamsResponseData(amount.toString(), denom);
    const depositCoin = mapDepositParams(deposit);
    expectCoin(depositCoin, amount, denom);
  })

  it('map deposit params - undefined gov params', async ()=> {
    expect(()=> {mapDepositParams(undefined)}).toThrowError(new Error('mapDepositParams - governanceParams is undefined'));

  })

  it('map deposit params - undefined deposit params', async ()=> {
    expect(()=> {mapDepositParams({} as GovernanceParameters)}).toThrowError(new Error('mapDepositParams - deposit params is undefined'));

  })

  it('map deposit params - undefined min_deposit', async ()=> {
    expect(()=> {mapDepositParams({deposit_params : {}} as GovernanceParameters)}).toThrowError(new Error('mapDepositParams - min_deposit is undefined'));

  })

  it('map voting option - yes success', async ()=> {
    const depositCoin = mapProposalVoteResponse(createYesProposalUserVoteResponse());
    expect(depositCoin).toBe(VoteOption.Yes);
  })

  it('map voting option - abstain success', async ()=> {
    const depositCoin = mapProposalVoteResponse(createAbstainProposalUserVoteResponse());
    expect(depositCoin).toBe(VoteOption.Abstain);
  })

  it('map voting option - no success', async ()=> {
    const depositCoin = mapProposalVoteResponse(createNoProposalUserVoteResponse());
    expect(depositCoin).toBe(VoteOption.No);
  })

  it('map voting option - veto success', async ()=> {
    const depositCoin = mapProposalVoteResponse(createVetoProposalUserVoteResponse());
    expect(depositCoin).toBe(VoteOption.NoWithVeto);
  })

  it('map voting option - no vote success', async ()=> {
    const depositCoin = mapProposalVoteResponse({data: {proposal_vote: []}} as ProposalVoteResponse);
    expect(depositCoin).toBeNull();
  })

  it('map voting option - undefined resp', async ()=> {
    expect(()=> {mapProposalVoteResponse(undefined)}).toThrowError(new Error('mapProposalVoteResponse - proposal vote response is undefined'));
  })

  it('map voting option - undefined data', async ()=> {
    expect(()=> {mapProposalVoteResponse({} as ProposalVoteResponse)}).toThrowError(new Error('mapProposalVoteResponse - proposal vote response data is undefined'));
  })

  it('map voting option - undefined proposal vote', async ()=> {
    expect(()=> {mapProposalVoteResponse({data: {}} as ProposalVoteResponse)}).toThrowError(new Error('mapProposalVoteResponse - proposal vote is undefined'));
  })

  it('map voting option - unexpected vote type', async ()=> {
    expect(()=> {mapProposalVoteResponse(createProposalUserVoteResponse('UNEXPECTED_TYPE'))}).toThrowError(new Error("Unsupported vote option: 'UNEXPECTED_TYPE'"));
  })
});

