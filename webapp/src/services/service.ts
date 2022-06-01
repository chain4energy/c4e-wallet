import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import {DataHolder} from "@/models/data-holder";

export interface Service{

  getListData(pagination: PagingModel|null, lockScreen: boolean, localSpinner: LocalSpinner | null) : void;

  getListDataHolder() : DataHolder;
}
