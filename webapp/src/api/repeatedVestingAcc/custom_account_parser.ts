import { BaseAccount, ModuleAccount } from "cosmjs-types/cosmos/auth/v1beta1/auth";
import { assert } from "@cosmjs/utils";
import { Any } from "cosmjs-types/google/protobuf/any";
import Long from "long";
import { Uint64 } from "@cosmjs/math";
import {Account} from "@cosmjs/stargate";
import {
  BaseVestingAccount,
  ContinuousVestingAccount,
  DelayedVestingAccount,
  PeriodicVestingAccount,
} from "cosmjs-types/cosmos/vesting/v1beta1/vesting";
import {RepeatedContinuousVestingAccount} from "./vesting_account";
import { decodePubkey } from "@cosmjs/proto-signing";

export function customAccountParser(input: Any): Account {
  const { typeUrl, value } = input;

  switch (typeUrl) {
    // auth
    case "/cosmos.auth.v1beta1.BaseAccount":
      return accountFromBaseAccount(BaseAccount.decode(value));
    case "/cosmos.auth.v1beta1.ModuleAccount": {
      const baseAccount = ModuleAccount.decode(value).baseAccount;
      assert(baseAccount);
      return accountFromBaseAccount(baseAccount);
    }

    // vesting
    case "/chain4energy.c4echain.cfevesting.RepeatedContinuousVestingAccount": {
      const baseAccount = RepeatedContinuousVestingAccount.decode(value)?.base_vesting_account?.baseAccount;
      assert(baseAccount);
      return accountFromBaseAccount(baseAccount);
    }

    case "/cosmos.vesting.v1beta1.BaseVestingAccount": {
      const baseAccount = BaseVestingAccount.decode(value)?.baseAccount;
      assert(baseAccount);
      return accountFromBaseAccount(baseAccount);
    }
    case "/cosmos.vesting.v1beta1.ContinuousVestingAccount": {
      const baseAccount = ContinuousVestingAccount.decode(value)?.baseVestingAccount?.baseAccount;
      assert(baseAccount);
      return accountFromBaseAccount(baseAccount);
    }
    case "/cosmos.vesting.v1beta1.DelayedVestingAccount": {
      const baseAccount = DelayedVestingAccount.decode(value)?.baseVestingAccount?.baseAccount;
      assert(baseAccount);
      return accountFromBaseAccount(baseAccount);
    }
    case "/cosmos.vesting.v1beta1.PeriodicVestingAccount": {
      const baseAccount = PeriodicVestingAccount.decode(value)?.baseVestingAccount?.baseAccount;
      assert(baseAccount);
      return accountFromBaseAccount(baseAccount);
    }

    default:
      throw new Error(`Unsupported type: '${typeUrl}'`);
  }
}

function accountFromBaseAccount(input: BaseAccount): Account {
  const { address, pubKey, accountNumber, sequence } = input;
  const pubkey = pubKey ? decodePubkey(pubKey) : null;
  return {
    address: address,
    pubkey: pubkey,
    accountNumber: uint64FromProto(accountNumber).toNumber(),
    sequence: uint64FromProto(sequence).toNumber(),
  };
}

function uint64FromProto(input: number | Long): Uint64 {
  return Uint64.fromString(input.toString());
}
