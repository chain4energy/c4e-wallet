import {ToastsTypeEnum} from "@/services/toasts/toasts-type.enum";
import {useToast} from "vue-toastification";


export class ToastsService {

  private timeout = 30 * 1000;
  private toastTypeMap = new Map<ToastsTypeEnum, Date>();
  private static instance: ToastsService;
  private toast = useToast();

  public static getInstance(): ToastsService {
    if (!ToastsService.instance) {
      ToastsService.instance = new ToastsService();
    }
    return ToastsService.instance;
  }

  public errorToast(toastType: ToastsTypeEnum, message: string) {
    const lastToast = this.toastTypeMap.get(toastType);

    if(!lastToast || (lastToast && Math.abs(new Date().getTime() - lastToast.getTime()) > this.timeout)) {
      // this.toast.error(message);
      this.toastTypeMap.set(toastType, new Date());
    }
  }

  public successToast(toastType: ToastsTypeEnum, message: string) {
    const lastToast = this.toastTypeMap.get(toastType);

    if(lastToast && Math.abs(new Date().getTime() - lastToast.getTime()) < this.timeout) {
      this.toast.success(message);
    }
    this.toastTypeMap.set(toastType, new Date());
  }
}
