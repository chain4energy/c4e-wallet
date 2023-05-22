/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";

export const protobufPackage = "chain4energy.c4echain.cfeminter";

export interface MsgSignData {
  signer: string;
  data: Uint8Array;
}

export interface MsgSignDataResponse {}

const baseMsgSignData: object = { signer: "" };

export const MsgSignData = {
  encode(message: MsgSignData, writer: Writer = Writer.create()): Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgSignData {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSignData } as MsgSignData;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSignData {
    const message = { ...baseMsgSignData } as MsgSignData;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = String(object.signer);
    } else {
      message.signer = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    return message;
  },

  toJSON(message: MsgSignData): unknown {
    const obj: any = {};
    message.signer !== undefined && (obj.signer = message.signer);
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSignData>): MsgSignData {
    const message = { ...baseMsgSignData } as MsgSignData;
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = object.data;
    } else {
      message.data = new Uint8Array();
    }
    return message;
  },
};

const baseMsgSignDataResponse: object = {};

export const MsgSignDataResponse = {
  encode(_: MsgSignDataResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgSignDataResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSignDataResponse } as MsgSignDataResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgSignDataResponse {
    const message = { ...baseMsgSignDataResponse } as MsgSignDataResponse;
    return message;
  },

  toJSON(_: MsgSignDataResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgSignDataResponse>): MsgSignDataResponse {
    const message = { ...baseMsgSignDataResponse } as MsgSignDataResponse;
    return message;
  },
};

// /** Msg defines the Msg service. */
// export interface Msg {
//   /** this line is used by starport scaffolding # proto/tx/rpc */
//   SignData(request: MsgSignData): Promise<MsgSignDataResponse>;
// }

// export class MsgClientImpl implements Msg {
//   private readonly rpc: Rpc;
//   constructor(rpc: Rpc) {
//     this.rpc = rpc;
//   }
//   SignData(request: MsgSignData): Promise<MsgSignDataResponse> {
//     const data = MsgSignData.encode(request).finish();
//     const promise = this.rpc.request(
//       "chain4energy.c4echain.cfeminter.Msg",
//       "SignData",
//       data
//     );
//     return promise.then((data) => MsgSignDataResponse.decode(new Reader(data)));
//   }
// }

// interface Rpc {
//   request(
//     service: string,
//     method: string,
//     data: Uint8Array
//   ): Promise<Uint8Array>;
// }

// declare var self: any | undefined;
// declare var window: any | undefined;
// var globalThis: any = (() => {
//   if (typeof globalThis !== "undefined") return globalThis;
//   if (typeof self !== "undefined") return self;
//   if (typeof window !== "undefined") return window;
//   if (typeof global !== "undefined") return global;
//   throw "Unable to locate global object";
// })();

// const atob: (b64: string) => string =
//   globalThis.atob ||
//   ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

// const btoa: (bin: string) => string =
//   globalThis.btoa ||
//   ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(""));
}

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
