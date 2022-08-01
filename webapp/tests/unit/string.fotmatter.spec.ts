import { formatString } from "@/utils/string-formatter";

describe('tests format string function', () => {

  it('tests format string function', async () => {
    expect(formatString('/cosmos/bank/v1beta1/balances/{address}/by_denom?denom={denom}',{address: "12345", denom: "c4e"})).toBe('/cosmos/bank/v1beta1/balances/12345/by_denom?denom=c4e');
    expect(formatString('/cosmos/bank/v1beta1/balances/{0}/by_denom?denom={1}',["12345","c4e"])).toBe('/cosmos/bank/v1beta1/balances/12345/by_denom?denom=c4e');
  });

});
