import {Pagination} from "@/models/pagination";
import {Validator} from "@/models/validator";

export class Validators {

  pagination: Pagination = new Pagination();
  validators: Validator[] = Array<Validator>();

}
export interface ValidatorsList{
  validators: Array<Validator>
}
