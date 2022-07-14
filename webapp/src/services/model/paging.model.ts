// const (
// // query params
// limit  = "limit"
// offset = "offset"
// page   = "page"
// sort   = "sort"
//
// // order by
// ASC  = "asc"
// DESC = "desc"
//
// // filter operator
// LTE = "lte"
// GTE = "gte"
// EQ  = "eq"
// )
import { DataTablePageEvent, DataTableSortEvent} from "primevue/datatable";
import {DefaultSortingModel} from "@/services/model/defaultSorting.model";

export class PagingModel{
  private _limit = 10;
  private offset = 0;
  private sortField = '';
  private sortOrder = '';
  private filterFields : string[] | undefined = [];
  private filterValues: string[] = [];

  constructor(filterFields: string[] | undefined) {
    this.filterFields = filterFields;
  }

  toAxiosParams(): { [k: string]: any } {
    const retVal: { [k: string]: any } = {};
    retVal.limit = this._limit;
    retVal.offset = this.offset;
    if (this.sortField !== null && this.sortField.length > 0) {
      retVal.sort = this.sortOrder + ":" + this.sortField;
    }
    if(this.filterFields !== undefined && this.filterValues !== null && this.filterValues.length > 0) {
      retVal.filterFields = this.filterFields.toString();
      retVal.filterValues = this.filterValues.toString();
    }
    console.log("toAxiosParams:", JSON.stringify(retVal, null, 2));
    return retVal;
  }


  fromDataTableSortEvent(event : DataTableSortEvent) : PagingModel{
    this.offset = event.first;
    this._limit = event.rows;
    if(  event.sortField !== undefined && event.sortField !== null && event.sortField.length > 0 ){
      this.sortField = event.sortField.toString();
      if (event.sortOrder == 1) {
        this.sortOrder = 'asc';
      } else {
        this.sortOrder = 'desc';
      }
    } else {
      this.sortOrder = '';
      this.sortField = '';
    }
    return this;
  }


  fromDataTablePageEvent(event : DataTablePageEvent) : PagingModel{
    return this.fromDataTableSortEvent(event);
  }

  updateFilter(filter :string): PagingModel{
    const temp =filter.trim();
    if(filter.trim().length >0 ){
      this.filterValues = temp.split(" ");
    } else {
      this.filterValues = [];
    }

    return this;
  }

  setDefaultSorting(defaultSorting: DefaultSortingModel){
    if(this.sortField.length == 0) {
      this.sortField = defaultSorting.getSortField();
      this.sortOrder = defaultSorting.getSortOrder();
    }
  }

  clearSorting(){
    this.sortField = '';
    this.sortOrder = '';
  }

  clearFilter(){
    this.filterValues = [];
  }


  set limit(value: number) {
    this._limit = value;
  }
}
