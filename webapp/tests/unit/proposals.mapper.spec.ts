import { mapProposal, mapProposalByID, mapProposals } from "@/models/mapper/proposals.mapper";
import {
  createProposal,
  createProposals,
  defaultProposals,
  defaultProposalsParameters,
  expectProposal, expectProposals
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
});
