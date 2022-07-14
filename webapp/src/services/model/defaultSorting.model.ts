export class DefaultSortingModel {

  private readonly sortOrder:string;
  private readonly sortField:string;

  constructor(sortOrder: string, sortField: string) {
    this.sortOrder = sortOrder;
    this.sortField = sortField;
  }

  getSortOrder(): string {
    return this.sortOrder;
  }

  getSortField(): string {
    return this.sortField;
  }
}
