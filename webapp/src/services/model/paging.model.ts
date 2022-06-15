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
import {DataTableFilterEvent, DataTablePageEvent, DataTableSortEvent} from "primevue/datatable";

export class PagingModel{
  private limit = 20;
  private offset = 0;
  private sortField = '';
  private sortOrder = '';
  private filterFields : string[] = [];
  private filterValues: string[] = [];
  private key = '';

  constructor(filterFields: string[]) {
    this.filterFields = filterFields;
  }

  toAxiosParams(): { [k: string]: any } {
    const retVal: { [k: string]: any } = {};
    retVal['pagination.count_total'] = 'true';
    retVal['pagination.limit'] = this.limit;
    retVal['pagination.offset'] = this.offset;
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
    this.limit = event.rows;
    if(  event.sortField !== undefined && event.sortField !== null && event.sortField.length > 0 ){
      this.sortField = event.sortField.toString();
      if (event.sortOrder == 1) {
        this.sortOrder = 'asc';
      } else {
        this.sortOrder = 'desc';
      }
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

  clearFilter(){
    this.filterValues = [];
  }
  setOffset(offset: number) {
    this.offset = offset;
  }
  setLimit(limit: number) {
    this.limit = limit;
  }
  setKey(key: string) {
    this.key = key;
  }
}
