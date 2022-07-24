export enum ProposalType {
  Accepted,
  Rejected,
}

export class Proposal {
  type: ProposalType;

  constructor (type: ProposalType, address: string) {
    this.type = type;
  }

}
