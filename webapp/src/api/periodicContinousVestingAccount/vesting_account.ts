/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "@/api/cosmos/base/v1beta1/coin";
import { BaseVestingAccount } from "@/api/cosmos/vesting/v1beta1/vesting";

export const protobufPackage = "chain4energy.c4echain.cfevesting";

/** ContinuousVestingPeriod defines a length of time and amount of coins that will vest. */
export interface ContinuousVestingPeriod {
  start_time: number;
  end_time: number;
  amount: Coin[];
}

/**
 * PeriodicContinuousVestingAccount implements the VestingAccount interface. It
 * periodically vests by unlocking coins during each specified period.
 */
export interface PeriodicContinuousVestingAccount {
  baseVestingAccount: BaseVestingAccount | undefined;
  startTime: number;
  vestingPeriods: ContinuousVestingPeriod[];
}

function createBaseContinuousVestingPeriod(): ContinuousVestingPeriod {
  return { start_time: 0, end_time: 0, amount: [] };
}

export const ContinuousVestingPeriod = {
  encode(message: ContinuousVestingPeriod, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.start_time !== 0) {
      writer.uint32(8).int64(message.start_time);
    }
    if (message.end_time !== 0) {
      writer.uint32(16).int64(message.end_time);
    }
    for (const v of message.amount) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContinuousVestingPeriod {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContinuousVestingPeriod();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.start_time = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.end_time = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.amount.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContinuousVestingPeriod {
    return {
      start_time: isSet(object.start_time) ? Number(object.start_time) : 0,
      end_time: isSet(object.end_time) ? Number(object.end_time) : 0,
      amount: Array.isArray(object?.amount) ? object.amount.map((e: any) => Coin.fromJSON(e)) : [],
    };
  },

  toJSON(message: ContinuousVestingPeriod): unknown {
    const obj: any = {};
    message.start_time !== undefined && (obj.startTime = Math.round(message.start_time));
    message.end_time !== undefined && (obj.endTime = Math.round(message.end_time));
    if (message.amount) {
      obj.amount = message.amount.map((e) => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.amount = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContinuousVestingPeriod>, I>>(object: I): ContinuousVestingPeriod {
    const message = createBaseContinuousVestingPeriod();
    message.start_time = object.start_time ?? 0;
    message.end_time = object.end_time ?? 0;
    message.amount = object.amount?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBasePeriodicContinuousVestingAccount(): PeriodicContinuousVestingAccount {
  return { baseVestingAccount: undefined, startTime: 0, vestingPeriods: [] };
}

export const PeriodicContinuousVestingAccount = {
  encode(message: PeriodicContinuousVestingAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.baseVestingAccount !== undefined) {
      BaseVestingAccount.encode(message.baseVestingAccount, writer.uint32(10).fork()).ldelim();
    }
    if (message.startTime !== 0) {
      writer.uint32(16).int64(message.startTime);
    }
    for (const v of message.vestingPeriods) {
      ContinuousVestingPeriod.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PeriodicContinuousVestingAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeriodicContinuousVestingAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.baseVestingAccount = BaseVestingAccount.decode(reader, reader.uint32());
          break;
        case 2:
          message.startTime = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.vestingPeriods.push(ContinuousVestingPeriod.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PeriodicContinuousVestingAccount {
    return {
      baseVestingAccount: isSet(object.baseVestingAccount)
        ? BaseVestingAccount.fromJSON(object.baseVestingAccount)
        : undefined,
      startTime: isSet(object.startTime) ? Number(object.startTime) : 0,
      vestingPeriods: Array.isArray(object?.vestingPeriods)
        ? object.vestingPeriods.map((e: any) => ContinuousVestingPeriod.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PeriodicContinuousVestingAccount): unknown {
    const obj: any = {};
    message.baseVestingAccount !== undefined && (obj.baseVestingAccount = message.baseVestingAccount
      ? BaseVestingAccount.toJSON(message.baseVestingAccount)
      : undefined);
    message.startTime !== undefined && (obj.startTime = Math.round(message.startTime));
    if (message.vestingPeriods) {
      obj.vestingPeriods = message.vestingPeriods.map((e) => e ? ContinuousVestingPeriod.toJSON(e) : undefined);
    } else {
      obj.vestingPeriods = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PeriodicContinuousVestingAccount>, I>>(
    object: I,
  ): PeriodicContinuousVestingAccount {
    const message = createBasePeriodicContinuousVestingAccount();
    message.baseVestingAccount = (object.baseVestingAccount !== undefined && object.baseVestingAccount !== null)
      ? BaseVestingAccount.fromPartial(object.baseVestingAccount)
      : undefined;
    message.startTime = object.startTime ?? 0;
    message.vestingPeriods = object.vestingPeriods?.map((e) => ContinuousVestingPeriod.fromPartial(e)) || [];
    return message;
  },
};


type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
    : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
      : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
