import { GovernanceParameters } from "@/models/blockchain/proposals";
import { mapProposal, mapProposalByID, mapProposals, mapTallyParams } from "@/models/mapper/proposals.mapper";
import {
  createProposal,
  createProposals,
  createTallyParamsResponseData,
  defaultProposals,
  defaultProposalsParameters,
  expectProposal, expectProposals, expectTallyParams
} from "../utils/proposal.blockchain.data.util";

const proposalId = defaultProposals[0];
const proposalParams = defaultProposalsParameters[0];

describe('tests mapping of proposals related data',  () => {

  it('maps undefined proposal', async ()=> {
    expect(() => {mapProposalByID(undefined)}).toThrow(new Error('Proposal is undefined'));
  });
//  it('maps proposal', async () => {
//    const bcProposals = createProposals([proposalId], [proposalParams], 0);
//    const storeProposal = mapProposal(bcProposals);
//    expectProposal(storeProposal, bcProposals[0]);
//  });

  it('map Proposal', async ()=> {
    const bcProposal = createProposal();
    const storeProposal = mapProposal(bcProposal);
    expectProposal(storeProposal, bcProposal);
  })

  it('maps undefined proposals', async ()=>{
    expect(()=> {mapProposals(undefined)}).toThrowError(new Error('Proposals list is undefined'));
  });
  it('maps proposals', async () => {
    const bcProposals = createProposals();
    const storeProposals = mapProposals(bcProposals);

    expectProposals(storeProposals);

  });

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

});
