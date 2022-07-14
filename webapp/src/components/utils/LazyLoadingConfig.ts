import {DataTableService} from "@/services/data-table.service";

export class LazyLoadingConfig{

  private _dataTableService: DataTableService;
  private _globalFilterFields: string[] | undefined;

  constructor(dataTableService: DataTableService) {
    this._dataTableService = dataTableService;
  }

  get dataTableService(): DataTableService {
    return this._dataTableService;
  }


  setGlobalFilterFields(value: string[] | undefined) :LazyLoadingConfig{
    this._globalFilterFields = value;
    return this;
  }

  get globalFilterFields(): string[] | undefined {
    return this._globalFilterFields;
  }
}
