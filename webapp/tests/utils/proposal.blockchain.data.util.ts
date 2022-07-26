import { Proposal, ProposalStatus } from "@/models/store/proposal";
import { Validator } from "@/models/store/validator";
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
  expect(actualProposal.proposal_id).toBe(expectedBcProposal.proposal_id);
  expect(actualProposal.content).toEqual(expectedBcProposal.content);
  expect(actualProposal.content.type).toBe(expectedBcProposal.content.type);
  expect(actualProposal.content.title).toBe(actualProposal.content.title);
  expect(actualProposal.content.changes).toBe(actualProposal.content.changes)
  expect(actualProposal.status).toBe(expectedBcProposal.status);
  expect(actualProposal.final_tally_result).toBe(actualProposal.final_tally_result);
  expect(actualProposal.submit_time).toBe(actualProposal.submit_time);
  expect(actualProposal.deposit_end_time).toBe(actualProposal.deposit_end_time);
  expect(actualProposal.total_deposit).toBe(actualProposal.total_deposit);
  expect(actualProposal.voting_end_time).toBe(actualProposal.voting_start_time);
  expect(actualProposal.voting_start_time).toBe(actualProposal.voting_start_time)
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
      yes: 'some data',
      abstain: 'some data',
      no: 'some data',
      no_with_veto: 'some data',
    },
    submit_time: 'some data',
    deposit_end_time: 'some data',
    total_deposit: [
      {
        denom: 'some data',
        amount: 'some data',
      },
      {
        denom: 'some data',
        amount: 'some data',
      },
      {
        denom: 'some data',
        amount: 'some data',
      },
    ],
    voting_start_time: 'some data',
    voting_end_time:'some data',
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
        yes: 'some data',
        abstain: 'some data',
        no: 'some data',
        no_with_veto: 'some data',
      },
      submit_time: 'some data',
      deposit_end_time: 'some data',
      total_deposit: [
        {
          denom: 'some data',
          amount: 'some data',
        }
      ],
      voting_start_time: 'some data',
      voting_end_time:'some data',
    })
  }
  return proposalsArray;
}
export function expectEmptyProposals(proposalsData: { proposals: Proposal[], numberOfActive: number } | undefined) {
  expect(proposalsData).not.toBeUndefined();
  expect(proposalsData?.proposals.length).toBe(0);
  expect(proposalsData?.numberOfActive).toBe(0);
}
