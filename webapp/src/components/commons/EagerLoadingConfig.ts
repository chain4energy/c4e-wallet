import {DataTableFilterMeta} from "primevue/datatable";

export class EagerLoadingConfig<T>{
  private _filters: DataTableFilterMeta | undefined;
  private _elements: Array<T>;


  constructor(elements: Array<T>) {
    this._elements = elements;
  }

  get elements(): Array<T> {
    return this._elements;
  }

  setFilters(value: DataTableFilterMeta | undefined)  :EagerLoadingConfig<T>{
    this._filters = value;
    return this;
  }

  get filters(): DataTableFilterMeta | undefined {
    return this._filters;
  }

}
