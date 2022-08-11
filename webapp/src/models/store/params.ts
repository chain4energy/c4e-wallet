export class Params {
  unbonding_time: number;
  max_validators: number;
  max_entries: number;
  historical_entries: number;
  bond_denom: string;
  dateWhenComplete: Date
  constructor(
    unbonding_time: string,
    max_validators: number,
    max_entries: number,
    historical_entries: number,
    bond_denom: string,
    ) {
      this.unbonding_time = Number(unbonding_time.slice(0, -1))/86400
      this.max_entries = max_entries;
      this.max_validators = max_validators;
      this.historical_entries = historical_entries;
      this.bond_denom = bond_denom;
      this.dateWhenComplete = new Date(Date.now() + Number(unbonding_time.slice(0, -1))* 1000);

    }
}
