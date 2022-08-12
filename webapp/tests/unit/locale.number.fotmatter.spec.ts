import { formatBigNumber } from "@/utils/locale-number-formatter";

describe('tests format number function', () => {

  it('tests format number function', async () => {
    expect(formatBigNumber('en-US', '213123213213124214124123.23123')).toBe('213,123,213,213,124,214,124,123.23123');
    expect(formatBigNumber('en-US', '24123.23123')).toBe('24,123.23123');
    expect(formatBigNumber('en-US', '4123.23123')).toBe('4,123.23123');
    expect(formatBigNumber('en-US', '3.23123')).toBe('3.23123');
    expect(formatBigNumber('en-US', '0.23123')).toBe('0.23123');

});

});
