import { Proposal, ProposalStatus } from "@/models/store/proposal";
import { Validator } from "@/models/store/validator";
import { BigDecimal } from "../../src/models/store/big.decimal";
export const defaultProposals = [
  '1',
  '3',
  '5',
  '6',
  '12',
  '112',
];
export const defaultProposalsParameters = [
  { status: "PROPOSAL_STATUS_PASSED" },
  { status: "PROPOSAL_STATUS_REJECTED" },
  { status: "PROPOSAL_STATUS_FAILED" },
  { status: "PROPOSAL_STATUS_UNSPECIFIED" },
  { status: "PROPOSAL_STATUS_DEPOSIT_PERIOD" },
  { status: "PROPOSAL_STATUS_VOTING_PERIOD" },
];

export const fakeDate = "2022-07-06T09:06:09.665518467Z";
export function createProposalsResponseData(
  proposals= defaultProposals,
  proposalsParameters = defaultProposalsParameters,
  positionOffset = 0,
  total: number | undefined = undefined,
  nextKey: string | null = null) {
  return {
    proposals: createProposals(proposals, proposalsParameters, positionOffset),
    pagination: {
      next_key: nextKey,
      total: total === undefined ? proposals.length : total
    }
  };
}
export function expectProposal(actualProposal: Proposal, expectedBcProposal: any) {
  expect(actualProposal).not.toBeUndefined();
  expect(actualProposal.proposalId).toBe(Number(expectedBcProposal.proposal_id));
  expect(actualProposal.content).toEqual(expectedBcProposal.content);
  expect(actualProposal.status).toBe(expectedBcProposal.status);
  expect(actualProposal.finalTallyResult.yes).toBe(Number(expectedBcProposal.final_tally_result.yes));
  expect(actualProposal.finalTallyResult.no).toBe(Number(expectedBcProposal.final_tally_result.no));
  expect(actualProposal.finalTallyResult.abstain).toBe(Number(expectedBcProposal.final_tally_result.abstain));
  expect(actualProposal.finalTallyResult.noWithVeto).toBe(Number(expectedBcProposal.final_tally_result.no_with_veto));
  expect(actualProposal.submitTime).toStrictEqual(new Date(expectedBcProposal.submit_time));
  expect(actualProposal.depositEndTime).toStrictEqual(new Date(expectedBcProposal.deposit_end_time));
  expect(actualProposal.totalDeposit.length).toBe(expectedBcProposal.total_deposit.length);
  expect(actualProposal.totalDeposit[0].amount).toBe(BigInt(expectedBcProposal.total_deposit[0].amount));
  expect(actualProposal.votingEndTime).toStrictEqual(new Date(expectedBcProposal.voting_end_time));
  expect(actualProposal.votingStartTime).toStrictEqual(new Date(expectedBcProposal.voting_start_time));
}

export function expectProposals(
  proposalsData: { proposals: Proposal[],
    numberOfActive: number } | undefined,
  expectedProposals = defaultProposals,
  expectedProposalsParameters = defaultProposalsParameters){
  expect(proposalsData).not.toBeUndefined();
  expect(proposalsData?.proposals.length).toBe(expectedProposals.length);
  expect(proposalsData?.numberOfActive).toBe(findNumberOfActiveProposals(expectedProposalsParameters));
}
export function findNumberOfActiveProposals(proposalsParameters = defaultProposalsParameters) {
  let active = 0;
  proposalsParameters.forEach(params => {
    if (params.status === 'PROPOSAL_STATUS_PASSED') {
      active++;
    }
  })
  return active;
}
export function createProposal(){
  const proposal = {
    proposal_id: "2",
    content: {
      type: 'some data',
      title: 'some data',
      description: 'some data',
      changes:[
        {
          subspace: 'some data',
          key: 'some data',
          value: {
            mindeposit: 'some data',
          }
        },
      ]
    },
    status: "PROPOSAL_STATUS_PASSED",
    final_tally_result: {
      yes: '123',
      abstain: '12334',
      no: '43850834075',
      no_with_veto: '19283012073',
    },
    submit_time: fakeDate ,
    deposit_end_time: fakeDate ,
    total_deposit: [
      {
        denom: 'some data',
        amount: '2340802384234234',
      },
      {
        denom: 'some data',
        amount: '23408234293840203',
      },
      {
        denom: 'some data',
        amount: '23408023842342342',
      },
    ],
    voting_start_time: fakeDate ,
    voting_end_time:fakeDate ,
  };
  return proposal;
}
export function createProposals(
  proposals = defaultProposals,
  proposalsParameters = defaultProposalsParameters,
  positionOffset = 0) {
  if (proposals.length !== proposalsParameters.length) {
    throw new Error('proposals.length !== proposalsParameters.length')
  }
  const proposalsArray = [];
  for (let i = 0; i < proposals.length; i++) {
    const position = i + positionOffset;
    proposalsArray.push({
      proposal_id: proposals[i],
      content: {
        type: 'some data',
        title: 'some data',
        description: 'some data',
        changes:[
          {
            subspace: 'some data',
            key: 'some data',
            value: {
              mindeposit: 'some data',
            }
          },
          {
            subspace: 'some data',
            key: 'some data',
            value: {
              mindeposit: 'some data',
            }
          }
        ]

      },
      status: proposalsParameters[i].status,
      final_tally_result: {
        yes: '123',
        abstain: '12334',
        no: '43850834075',
        no_with_veto: '19283012073',
      },
      submit_time:fakeDate ,
      deposit_end_time: fakeDate ,
      total_deposit: [
        {
          denom: 'some data',
          amount: '2340802384234234',
        },
        {
          denom: 'some data',
          amount: '23408234293840203',
        },
        {
          denom: 'some data',
          amount: '2340802384234234',
        },
      ],
      voting_start_time: fakeDate ,
      voting_end_time: fakeDate ,
    })
  }
  return proposalsArray;
}
export function expectEmptyProposals(proposalsData: { proposals: Proposal[], numberOfActive: number } | undefined) {
  expect(proposalsData).not.toBeUndefined();
  expect(proposalsData?.proposals.length).toBe(0);
  expect(proposalsData?.numberOfActive).toBe(0);
}
