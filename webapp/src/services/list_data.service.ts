import {DataHolder} from "@/models/data-holder";

export interface ListDataService<T>{

  getListDataUrlByRole() : string;

  setListDataToStore(dataHolder: T) :void;

}
