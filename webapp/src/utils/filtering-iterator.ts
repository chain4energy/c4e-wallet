export function filteringIterator<T, M = T>(origIterator: IterableIterator<T>, filter: (val: T) => boolean, map?: (val: T) => M,): IterableIterator<M> {
  return new FilteringIterableIterator(origIterator, filter, map);
}

class FilteringIterableIterator<T, M = T> implements IterableIterator<M> {

  private iterator: IterableIterator<T>;
  private filter: (val: T) => boolean;
  private map: (val: T) => M;

  constructor(
    iterator: IterableIterator<T>,
    filter: (val: T) => boolean,
    map?: (val: T) => M,
  ) {
    this.iterator = iterator;
    this.filter = filter;
    if (map) {
      this.map = map;
    } else {
      this.map = (val: T): M => {return (val as unknown as M)};
    }
  }

  [Symbol.iterator](): IterableIterator<M> {
   return this;
  }
  next(...args: [] | [undefined]): IteratorResult<M, any> {
    const next = this.iterator.next(...args)
    if (next.done) {
      return {
        done : next.done,
        value : this.map(next.value)
      }
    }
    const val = next.value;
    return this.filter(val) ? {
      done : next.done,
      value : this.map(next.value)
    } : this.next(...args);
  }

}
