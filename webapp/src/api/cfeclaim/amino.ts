import {AminoConverters} from "@cosmjs/stargate";
import {AminoMsg} from "@cosmjs/amino";
import {MsgClaim, MsgInitialClaim} from "./tx";
import {MsgCreateVestingPool, MsgWithdrawAllAvailable} from "@/api/cfevesting/tx";
import {Duration} from "@/api/google/protobuf/duration";

// const aminoTypes = new AminoTypes(createVestingAminoConverters())
//     client = await SigningStargateClient.connectWithSigner(
//         blockchainConfig.rpcUrl,
//         offlineSigner,
//         {registry, aminoTypes}
//     );
export function createCustomAminoConverters(): AminoConverters {
  return {
    "/chain4energy.c4echain.cfeclaim.MsgInitialClaim": {
      aminoType: "cfeclaim/InitialClaim",
      toAmino: ({
                  claimer,
                  campaignId,
                  destinationAddress,
                }: MsgInitialClaim): AminoMsgInitialClaim["value"] => ({
        claimer: claimer,
        campaign_id: campaignId + "",
        destination_address: destinationAddress,
      }),
      fromAmino: ({
                    claimer,
                    campaign_id,
                    destination_address,
                  }: AminoMsgInitialClaim["value"]): MsgInitialClaim => ({
        claimer: claimer,
        campaignId: +campaign_id,
        destinationAddress: destination_address,
      }),
    },
    "/chain4energy.c4echain.cfeclaim.MsgClaim": {
      aminoType: "cfeclaim/Claim",
      toAmino: ({
                  claimer,
                  campaignId,
                  missionId,
                }: MsgClaim): AminoMsgClaim["value"] => ({
        claimer: claimer,
        campaign_id: campaignId + "",
        mission_id: missionId + "",
      }),
      fromAmino: ({
                    claimer,
                    campaign_id,
                    mission_id,
                  }: AminoMsgClaim["value"]): MsgClaim => ({
        claimer: claimer,
        campaignId: +campaign_id,
        missionId: +mission_id,
      }),
    },
    "/chain4energy.c4echain.cfevesting.MsgCreateVestingPool": {
      aminoType: "cfevesting/CreateVestingPool",
      toAmino: ({
                  amount,
                  duration,
                  vestingType,
                  name,
                  owner,
                }: MsgCreateVestingPool): AminoMsgCreateVestingPool["value"] => ({
        amount: amount,
        duration: duration,
        name: name,
        vestingType,
        owner: owner,
      }),
      fromAmino: ({
                    amount,
                    duration,
                    name,
                    owner,
                    vestingType,
                  }: AminoMsgCreateVestingPool["value"]): MsgCreateVestingPool => ({
       amount,
        duration,
        name,
        owner,
        vestingType
      }),
    },
    "/chain4energy.c4echain.cfevesting.MsgWithdrawAllAvailable": {
      aminoType: "cfevesting/WithdrawAllAvailable",
      toAmino: ({
                  owner
                }: MsgWithdrawAllAvailable): AminoMsgWithdrawAllAvailable["value"] => ({
        owner
      }),
      fromAmino: ({
                    owner,
                  }: AminoMsgWithdrawAllAvailable["value"]): MsgWithdrawAllAvailable => ({
        owner
      }),
    }
  };
}

// REMEMBER TO SET ALL FIELDS TO STRINGS!!!
export interface AminoMsgWithdrawAllAvailable extends AminoMsg {
  readonly type: "cfevesting/WithdrawAllAvailable";
  readonly value: {
    readonly owner: string,
  };
}

// REMEMBER TO SET ALL FIELDS TO STRINGS!!!
export interface AminoMsgCreateVestingPool extends AminoMsg {
  readonly type: "cfevesting/CreateVestingPool";
  readonly value: {
    readonly amount: string,
    readonly duration: Duration | undefined,
    readonly name: string,
    readonly vestingType: string,
    readonly owner: string,
  };
}


// REMEMBER TO SET ALL FIELDS TO STRINGS!!!
export interface AminoMsgInitialClaim extends AminoMsg {
  readonly type: "cfeclaim/InitialClaim";
  readonly value: {
    readonly claimer: string;
    readonly campaign_id: string;
    readonly destination_address: string;
  };
}

// REMEMBER TO SET ALL FIELDS TO STRINGS!!!
export interface AminoMsgClaim extends AminoMsg {
  readonly type: "cfeclaim/Claim";
  readonly value: {
    claimer: string;
    campaign_id: string;
    mission_id: string;
  };
}
