import {pattern} from "@/utils/passwordPattern";

const regex = new RegExp(pattern);

describe('tests password pattern', () => {

  it('accepts proper passwords', async () => {
    expect(regex.test('34-fhsdjAb-32')).toBe(true);
    expect(regex.test('gfyr!12eD')).toBe(true);
    expect(regex.test('Hello123!')).toBe(true);
    expect(regex.test('12#$[Dood]5')).toBe(true);
  });

  it('rejects too short passwords', async () => {
    expect(regex.test('short1!')).toBe(false);
    expect(regex.test('gf')).toBe(false);
    expect(regex.test('asf12@')).toBe(false);
  });

  it('rejects passwords with spaces and tabs', async () => {
    expect(regex.test('Long12#4  123')).toBe(false);
    expect(regex.test('short 1')).toBe(false);
    expect(regex.test('as3@!        def!')).toBe(false);
    expect(regex.test('p@ss   T2b')).toBe(false);
  });

  it('rejects passwords without numbers', async () => {
    expect(regex.test('Longab!bb')).toBe(false);
    expect(regex.test('shortLONG#')).toBe(false);
    expect(regex.test('PASSWORD$%.')).toBe(false);
  });

  it('rejects passwords without special chars', async () => {
    expect(regex.test('LongabAB123')).toBe(false);
    expect(regex.test('shortLONG22')).toBe(false);
    expect(regex.test('PASSWORD55')).toBe(false);
  });

  it('rejects passwords without letters', async () => {
    expect(regex.test('1234!@#$')).toBe(false);
  });

});
