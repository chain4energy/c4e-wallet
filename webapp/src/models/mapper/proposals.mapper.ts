import { Propossals as BcProposals } from "@/models/blockchain/propossals";
import {Proposal as StoreProposals } from "@/models/store/proposal";

export function mapProposal(proposals: BcProposals| undefined): StoreProposals {
  if (proposals === undefined) {
    throw new Error('Account is undefined');
  }
  const typeUrl = proposals["@type"];
}
