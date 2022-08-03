export function filteringIterator<T>(origIterator: IterableIterator<T>, filter: (val: T) => boolean): IterableIterator<T> {
  return new FilteringIterableIterator(origIterator, filter);
}

class FilteringIterableIterator<T> implements IterableIterator<T> {

  private iterator: IterableIterator<T>;
  private filter: (val: T) => boolean;

  constructor(
    iterator: IterableIterator<T>,
    filter: (val: T) => boolean
  ) {
    this.iterator = iterator;
    this.filter = filter;
  }

  [Symbol.iterator](): IterableIterator<T> {
   return this;
  }
  next(...args: [] | [undefined]): IteratorResult<T, any> {
    const next = this.iterator.next(...args)
    if (next.done) {
      return next;
    }
    const val = next.value;
    return this.filter(val) ? next : this.next(...args);
  }

}
