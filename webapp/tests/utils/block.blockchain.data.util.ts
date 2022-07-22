import { Block } from "@/models/store/block";

export function createBlockResponseData(height: string, time: string) {
  return {
    block_id: {
      hash: "9wTFe6W9olfvWByFn3rAANg6+rm1E4EM8P6GBIIu+5Q=",
      part_set_header: {
        total: 1,
        hash: "VyT/WBpk+KSP0d57zFAeAiVyGI2bQv10yBgZhEn/OKY="
      }
    },
    block: {
      header: {
        version: {
          block: "11",
          app: "0"
        },
        chain_id: "c4e-net",
        height: height,
        time: time,
        last_block_id: {
          hash: "NvOx0gzPr1AjjVIRxYvz0gL1lwnxy3DrSY/jMmH/gkY=",
          part_set_header: {
            total: 1,
            hash: "UGV+NBn5D5EzJpzxWGq1bi2YUqTz1CnmpKRNtyf22zU="
          }
        },
        last_commit_hash: "bgMGjWMOY9Eg5pQSZdAM8EB/54Zxxoqi6lCqfinqclY=",
        data_hash: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
        validators_hash: "yQejvh+O9wwCdjIYvOJJ68H0tWiC96GO/LTy6pSXYjw=",
        next_validators_hash: "yQejvh+O9wwCdjIYvOJJ68H0tWiC96GO/LTy6pSXYjw=",
        consensus_hash: "BICRvH3cKD93v7+R1zxE2ljD34qcvIZ0Bdi389qtoi8=",
        app_hash: "x6eRetjJE4tZu6T6CCnNbS6aHFPs0nwivtyWQNEcFEE=",
        last_results_hash: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
        evidence_hash: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
        proposer_address: "WExB0WS8WY9mTMg6ckNPVdnGdMo="
      },
      data: {
        txs: []
      },
      evidence: {
        evidence: []
      },
      last_commit: {
        height: '' + (Number(height) - 1),
        round: 0,
        block_id: {
          hash: "NvOx0gzPr1AjjVIRxYvz0gL1lwnxy3DrSY/jMmH/gkY=",
          part_set_header: {
            total: 1,
            hash: "UGV+NBn5D5EzJpzxWGq1bi2YUqTz1CnmpKRNtyf22zU="
          }
        },
        signatures: [
          {
            block_id_flag: "BLOCK_ID_FLAG_COMMIT",
            validator_address: "WExB0WS8WY9mTMg6ckNPVdnGdMo=",
            timestamp: "2022-07-21T13:47:25.833663575Z",
            signature: "j/OOWZBP9IA0y5Lwfph328fgwehpeu-8vwbweiviwervhei9urvnofinuebieriuvOuKeL8Me2JdQELBmBk7eEqAA=="
          },
          {
            block_id_flag: "BLOCK_ID_FLAG_COMMIT",
            validator_address: "sG/3rC5Z/d478Q8P1EMi5R9WE04=",
            timestamp: "2022-07-21T13:47:25.824154018Z",
            signature: "0iLdfwjaisdbvipjsdnm[w39j908w3ehvwone9u3-n9uvh93wj9938h9wenhweh309wnonsibQMdmfJiApiPnLzDg=="
          },
        ]
      }
    }
  }
}

export function expectBlock(block: Block | undefined, expectedHeight: number, expectedTime: Date) {
  expect(block).not.toBeUndefined();
  expect(block).toBeInstanceOf(Block);
  expect(block?.height).toBe(expectedHeight);
  expect(block?.time).toStrictEqual(expectedTime);
}
