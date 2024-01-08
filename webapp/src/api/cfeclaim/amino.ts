import {AminoConverters} from "@cosmjs/stargate";
import { AminoMsg } from "@cosmjs/amino";
import { MsgInitialClaim, MsgClaim } from "./tx";

// const aminoTypes = new AminoTypes(createVestingAminoConverters())
//     client = await SigningStargateClient.connectWithSigner(
//         blockchainConfig.rpcUrl,
//         offlineSigner,
//         {registry, aminoTypes}
//     );
export function createCfeClaimAminoConverters(): AminoConverters {
    return {
        "/chain4energy.c4echain.cfeclaim.MsgInitialClaim": {
            aminoType: "cfeclaim/InitialClaim",
            toAmino: ({
                          claimer,
                          campaignId,
                          destinationAddress,
                      }: MsgInitialClaim): AminoMsgInitialClaim["value"] => ({
                        claimer: claimer,
                        campaign_id: campaignId,
                        destination_address: destinationAddress,
            }),
            fromAmino: ({
                claimer,
                campaign_id,
                destination_address,
                        }: AminoMsgInitialClaim["value"]): MsgInitialClaim => ({
                            claimer: claimer,
                            campaignId: campaign_id,
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
                        campaign_id: campaignId,
                        mission_id: missionId,
            }),
            fromAmino: ({
                claimer,
                campaign_id,
                mission_id,
                        }: AminoMsgClaim["value"]): MsgClaim => ({
                            claimer: claimer,
                            campaignId: campaign_id,
                            missionId: mission_id,
            }),
        }
    };
}

export interface AminoMsgInitialClaim extends AminoMsg {
    readonly type: "cfeclaim/InitialClaim";
    readonly value: {
        claimer: string;
        campaign_id: number;
        destination_address: string;
    };
}

export interface AminoMsgClaim extends AminoMsg {
    readonly type: "cfeclaim/Claim";
    readonly value: {
        claimer: string;
        campaign_id: number;
        mission_id: number;
    };
}