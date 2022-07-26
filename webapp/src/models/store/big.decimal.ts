const DECIMALS = 18;
const ROUNDED = true;
const SHIFT = BigInt("1" + "0".repeat(DECIMALS));

interface BigDecimalConstructor {
  new (value: bigint | number | BigDecimal | string): BigDecimal;
}

export interface BigDecimal {

  add(value: bigint | number | BigDecimal | string): BigDecimal;

  subtract(value: bigint | number | BigDecimal | string): BigDecimal;

  multiply(value: bigint | number | BigDecimal | string): BigDecimal;

  divide(value: bigint | number | BigDecimal | string): BigDecimal;

  toString(): string;

  toFixed(fractionDigits?: number, rounded?: boolean): string;

}

class BigDecimalImpl implements BigDecimal {

  private value: bigint;

  constructor(value: bigint | number | BigDecimal | string) {
    this.value = BigDecimalImpl.toInternalValue(value);

  }

  public add(value: bigint | number | BigDecimal | string) {
    const toAdd = BigDecimalImpl.toInternalValue(value);
    return fromInternalValue(this.value + toAdd);
  }
  public subtract(value: bigint | number | BigDecimal | string) {
    const toSub = BigDecimalImpl.toInternalValue(value);
    return fromInternalValue(this.value - toSub);
  }

  public multiply(value: bigint | number | BigDecimal | string) {
    const toMul = BigDecimalImpl.toInternalValue(value);
    return divideBigIntsWithRoundToBigDecimal(this.value * toMul, SHIFT);
  }
  public divide(value: bigint | number | BigDecimal | string) {
    const toDiv = BigDecimalImpl.toInternalValue(value);

    return divideBigIntsWithRoundToBigDecimal(this.value * SHIFT, toDiv);
  }

  public toString() {
    const s = (this.value + '').padStart(DECIMALS + 1, "0");
    const ints = s.slice(0, -DECIMALS);
    const decis = s.slice(-DECIMALS).replace(/\.?0+$/, "");
    return decis.length > 0 ? ints + "." + decis : ints;
  }

  public toFixed(fractionDigits = DECIMALS, rounded = true): string {
    let val = this.value;
    if (fractionDigits < 0) {
      return numberToFixed(val, DECIMALS);
    }
    if (fractionDigits < DECIMALS) {
      const shift = BigInt("1" + "0".repeat(DECIMALS - fractionDigits));
      val = divideBigIntsWithRound(rounded, val, shift);
    }
    return numberToFixed(val, fractionDigits);
  }

  private static toInternalValue(value: bigint | number | BigDecimal | string): bigint {
    if (value instanceof BigDecimalImpl) {
      return value.value;
    } if (typeof value === 'bigint') {
      return value * SHIFT;
    } else {
      const [ints, decis] = String(value).split('.').concat('');
      return BigInt(ints + decis.padEnd(DECIMALS, '0')
        .slice(0, DECIMALS))
        + BigInt(ROUNDED && decis[DECIMALS] >= '5');
    }
  }

}

export function divideBigInts(dividend: bigint, divisor: bigint) {
  return divideBigIntsWithRoundToBigDecimal(dividend * SHIFT, divisor);
}

export const BigDecimal: BigDecimalConstructor = BigDecimalImpl;


function divideBigIntsWithRoundToBigDecimal(dividend: bigint, divisor: bigint) {
  return fromInternalValue(divideBigIntsWithRound(ROUNDED, dividend, divisor));
}


function fromInternalValue(value: bigint): BigDecimal {
  return Object.assign(Object.create(BigDecimalImpl.prototype), { value: value });
}

function divideBigIntsWithRound(rounded: boolean, dividend: bigint, divisor: bigint): bigint {
  const absA = dividend >= 0n ? dividend : -dividend
  const absB = divisor >= 0n ? divisor : -divisor
  const absRemainderDoubled = (absA % absB) * 2n 
  return dividend / divisor + (
    rounded && absRemainderDoubled < absB
      ? 0n
      : (dividend > 0n) === (divisor > 0n)
          ? 1n
          : -1n
  )
}
function numberToFixed(value: bigint, fractionDigits: number): string {
  const s = (
    fractionDigits > DECIMALS ?
      value.toString() + "0".repeat(fractionDigits - DECIMALS) :
      value.toString()
  ).padStart(fractionDigits + 1, "0");
  if (!fractionDigits) {
    return s;
  }
  const ints = s.slice(0, -fractionDigits);
  const decis = s.slice(-fractionDigits);
  return ints + "." + decis;
}

