export interface SingleDataService<T>{

  getSingleDataUrlByRole() : string;

  setSingleDataToStore(singleData: T) :void;

}
