export class DataHolder<T> {
  amount = 0;
  elements: Array<T> = [];

  public createFromArray(array:Array<T>): DataHolder<T>{
    array.forEach((element)=>{this.elements.push(element);});
    return this;
  }
}
