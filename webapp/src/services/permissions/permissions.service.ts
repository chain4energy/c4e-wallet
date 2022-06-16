import {PagesEnum} from "@/services/permissions/pages-enum";
import {SidebarConfig, SidebarElement} from "@/services/permissions/sidebar.config";

export class PermissionsService{

  canAccess(page: PagesEnum) : boolean{
    return true;
    // const currentRole = useUserStore().getCurrentRole();
    // switch (page){
    //   case PagesEnum.PROVIDERS:
    //     if([RoleEnum.SUPER_ADMIN, RoleEnum.SUPER_AGENT].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.USERS:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.CONTRACTS:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.INVOICES:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.OFFERS:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.HOME:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.DOCUMENTS:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.CUSTOMERS:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN, RoleEnum.SUPER_AGENT].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.EMPLOYEES:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    //   case PagesEnum.PRODUCT_CATALOG:
    //     if([RoleEnum.PROSUMER, RoleEnum.SUPER_ADMIN].includes(currentRole)) {
    //       return true;
    //     }
    //     break;
    // }
    // return false;
  }

  sidebarElementOrder(): PagesEnum[]{
    return [PagesEnum.DASHBOARD, PagesEnum.STAKING, PagesEnum.GOVERNANCE, PagesEnum.VALIDATORS];
    // const currentRole = useUserStore().getCurrentRole();
    // switch (currentRole){
    //   case RoleEnum.SUPER_ADMIN:
    //     return [PagesEnum.HOME, PagesEnum.USERS, PagesEnum.PROVIDERS, PagesEnum.INVOICES, PagesEnum.CONTRACTS, PagesEnum.OFFERS,PagesEnum.DOCUMENTS, PagesEnum.CUSTOMERS,PagesEnum.EMPLOYEES, PagesEnum.PRODUCT_CATALOG]
    //   case RoleEnum.ADMINISTRATOR_FULL:
    //     break;
    //   case RoleEnum.ADMINISTRATOR_BASIC:
    //     break;
    //   case RoleEnum.SUPER_AGENT:
    //     break;
    //   case RoleEnum.AGENT:
    //     break;
    //   case RoleEnum.TRADER:
    //     break;
    //   case RoleEnum.PROSUMER:
    //     return [PagesEnum.HOME, PagesEnum.INVOICES];
    // }
    // //TODO: remove
    // return [PagesEnum.HOME, PagesEnum.USERS, PagesEnum.PROVIDERS, PagesEnum.INVOICES, PagesEnum.CONTRACTS, PagesEnum.OFFERS, PagesEnum.DOCUMENTS, PagesEnum.CUSTOMERS,PagesEnum.EMPLOYEES, PagesEnum.PRODUCT_CATALOG]
  }

  createSideBar(): SidebarElement[]{
    const sidebarConfig = new SidebarConfig();
    const rerVal = Array<SidebarElement>();
    // if(useUserStore().isLoggedIn) {
    //   console.log("createSideBar");

      const pagesEnums = this.sidebarElementOrder();
      for (const page of pagesEnums) {
        if(this.canAccess(page)){
          const configForPage = sidebarConfig.getConfigForPage(page);
          if(configForPage!== undefined) {
            rerVal.push(configForPage);
          }
        }
      }
    // }
    console.log(rerVal);
    return rerVal;
  }


}
