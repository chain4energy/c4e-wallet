import {Coin, DecCoin} from "@/models/store/common";

export class AirdropStore{
  atom_staked_balance: string;
  atom_address: string;
  c4e_address: string;
  base_airdrop: number;
  booster_1_airdrop: number;
  booster_2_airdrop: number;
  gleam_airdrop: number;
  total_amount: DecCoin;
  voted_on_proposal: boolean;
  atom_delegated_outside: number;
  delegated_outside: boolean;
  constructor(
    atom_staked_balance: string,
    atom_address: string,
    c4e_address: string,
    base_airdrop: number,
    booster_1_airdrop: number,
    booster_2_airdrop: number,
    gleam_airdrop: number,
    total_amount: DecCoin,
    voted_on_proposal: boolean,
    atom_delegated_outside: number,
    delegated_outside: boolean,
  ) {
    this.atom_staked_balance = atom_staked_balance;
    this.atom_address = atom_address;
    this.c4e_address = c4e_address;
    this.base_airdrop = base_airdrop;
    this.booster_1_airdrop = booster_1_airdrop;
    this.booster_2_airdrop = booster_2_airdrop;
    this.gleam_airdrop = gleam_airdrop;
    this.total_amount = total_amount;
    this.voted_on_proposal = voted_on_proposal;
    this.atom_delegated_outside = atom_delegated_outside;
    this.delegated_outside = delegated_outside;
  }
}
