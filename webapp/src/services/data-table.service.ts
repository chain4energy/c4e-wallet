import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import {DataHolder} from "@/models/data-holder";

export interface DataTableService<T> {

  fetchListData(pagination: PagingModel|null, lockScreen: boolean, localSpinner: LocalSpinner | null) : void;

  getListDataHolder() : DataHolder<T>;
}
