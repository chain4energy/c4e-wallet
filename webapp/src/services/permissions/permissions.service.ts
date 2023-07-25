import {PagesEnum} from "@/services/permissions/pages-enum";
import {SidebarConfig, SidebarElement} from "@/services/permissions/sidebar.config";
import {useConfigurationStore} from "@/store/configuration.store";

export class PermissionsService{

  sidebarElementOrder(): PagesEnum[]{
    const tempPagesEnum = [PagesEnum.DASHBOARD, PagesEnum.STAKING, PagesEnum.GOVERNANCE, PagesEnum.AIRDROP, PagesEnum.PORTFOLIO, PagesEnum.BUYTOKENS, PagesEnum.PROFILE];
    if(this.faucetAvailable()) {
      tempPagesEnum.push(PagesEnum.FAUCET);
    }
    return tempPagesEnum;
  }

  faucetAvailable(): boolean {
    return useConfigurationStore().config.faucetAvailable;
  }
  createSideBar(): SidebarElement[]{
    const sidebarConfig = new SidebarConfig();
    const rerVal = Array<SidebarElement>();
    const pagesEnums = this.sidebarElementOrder();
    for (const page of pagesEnums) {
      const configForPage = sidebarConfig.getConfigForPage(page);
      if(configForPage!== undefined) {
        rerVal.push(configForPage);
      }
    }
    return rerVal;
  }


}
