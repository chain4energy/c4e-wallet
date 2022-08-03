import { filteringIterator } from "@/utils/filtering-iterator";

const array = ['hey', 'fffff', 'bye'];

describe('tests format string function', () => {

  it('tests format string function', async () => {
    const iter = filteringIterator(array.entries(), (val: [number, string]): boolean => {
      return val[1] !== 'fffff';
    })

    const result = new Array<string>()
    for (const item of iter) {
      result.push(item[1])
    }
    expect(result.length).toBe(2);
    expect(result[0]).toBe(array[0]);
    expect(result[1]).toBe(array[2]);

  });

});
