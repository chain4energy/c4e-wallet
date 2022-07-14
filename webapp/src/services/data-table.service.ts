import {DataHolder} from "@/models/data-holder";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import {DefaultSortingModel} from "@/services/model/defaultSorting.model";
// import {DefaultSortingModel} from "@/services/model/defaultSorting.model";

export interface DataTableService {

  getDefaultSorting(): DefaultSortingModel;

  fetchListData(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null) : void;

  getListDataHolder() : DataHolder<any>;
}

