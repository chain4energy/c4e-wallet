import {PagesEnum} from "@/services/permissions/pages-enum";
import {SidebarConfig, SidebarElement} from "@/services/permissions/sidebar.config";
import {useConfigurationStore} from "@/store/configuration.store";

export class PermissionsService{

  sidebarElementOrder(): PagesEnum[]{
    return [PagesEnum.DASHBOARD, PagesEnum.STAKING, PagesEnum.GOVERNANCE, PagesEnum.AIRDROP,PagesEnum.FAUCET, PagesEnum.BUYTOKENS, PagesEnum.PROFILE];
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
