import { BigDecimal, divideBigInts } from "@/models/store/big.decimal";

describe('tests big decimal', () => {

  it('tests big decimal', async () => {
    expect( new BigDecimal(10n).toFixed(0)).toBe('10');
    expect( new BigDecimal(10.5).toFixed(0)).toBe('11');

    const one = new BigDecimal(1n);
    expect(one.toString()).toBe('1');
    expect(one.toFixed()).toBe('1.000000000000000000');
    expect(one.toFixed(4)).toBe('1.0000');
    expect(one.toFixed(40)).toBe('1.0000000000000000000000000000000000000000');
    expect(one.toFixed(0)).toBe('1');

    const half = new BigDecimal(0.5);
    expect(half.toString()).toBe('0.5');
    expect(half.toFixed()).toBe('0.500000000000000000');
    expect(half.toFixed(4)).toBe('0.5000');
    expect(half.toFixed(40)).toBe('0.5000000000000000000000000000000000000000');
    expect(one.toFixed(0)).toBe('1');

    const biggerHalf = new BigDecimal(0.500004);
    expect(biggerHalf.toString()).toBe('0.500004');
    expect(biggerHalf.toFixed()).toBe('0.500004000000000000');
    expect(biggerHalf.toFixed(4)).toBe('0.5000');
    expect(biggerHalf.toFixed(40)).toBe('0.5000040000000000000000000000000000000000');
    expect(one.toFixed(0)).toBe('1');

    const evenBiggerHalf = new BigDecimal(0.50005);
    expect(evenBiggerHalf.toString()).toBe('0.50005');
    expect(evenBiggerHalf.toFixed()).toBe('0.500050000000000000');
    expect(evenBiggerHalf.toFixed(4)).toBe('0.5001');
    expect(evenBiggerHalf.toFixed(40)).toBe('0.5000500000000000000000000000000000000000');
    expect(one.toFixed(0)).toBe('1');

    expect(divideBigInts(1n, 3n).toString()).toBe('0.333333333333333333')
    expect(divideBigInts(1n, 2n).toString()).toBe('0.5')
    expect(divideBigInts(15n, 3n).toString()).toBe('5')
    expect(divideBigInts(15n, 2n).toString()).toBe('7.5')

    expect((new BigDecimal(1n)).divide(3).toString()).toBe('0.333333333333333333')
    expect((new BigDecimal(15n)).divide(3).toString()).toBe('5')
    expect((new BigDecimal(15n)).divide(2).toString()).toBe('7.5')
    expect((new BigDecimal(3.3333)).divide(3).toString()).toBe('1.1111')

    expect((new BigDecimal(1n)).multiply(3).toString()).toBe('3')
    expect((new BigDecimal(15n)).multiply(3).toString()).toBe('45')
    expect((new BigDecimal(15n)).multiply(10).toString()).toBe('150')

    expect((new BigDecimal(1.111)).multiply(3).toString()).toBe('3.333')
    expect((new BigDecimal(15.3333)).multiply(3).toString()).toBe('45.9999')

    expect((new BigDecimal(3.3333)).add(3).toString()).toBe('6.3333')
    expect((new BigDecimal(3.3333)).subtract(3).toString()).toBe('0.3333')

    expect((new BigDecimal(3.3333) instanceof BigDecimal)).toBe(true)

  });



  

});

