import {PagesEnum} from "@/services/permissions/pages-enum";
import {SidebarConfig, SidebarElement} from "@/services/permissions/sidebar.config";
import {useConfigurationStore} from "@/store/configuration.store";

export class PermissionsService{

  sidebarElementOrder(): PagesEnum[]{
    const tempPagesEnum = [PagesEnum.DASHBOARD, PagesEnum.BOOST, PagesEnum.STAKING, PagesEnum.GOVERNANCE, PagesEnum.AIRDROP,  PagesEnum.DISTRIBUTION, PagesEnum.PORTFOLIO];
    if(this.publicSaleVisible()) {
      tempPagesEnum.push(PagesEnum.BUYTOKENS, PagesEnum.PROFILE);
    }
    if(this.faucetAvailable()) {
      tempPagesEnum.push(PagesEnum.FAUCET);
    }
    if(this.greenTreasuryVisible()) {
      tempPagesEnum.push(PagesEnum.GREENTREASURY);
    }
    return tempPagesEnum;
  }

  faucetAvailable(): boolean {
    return useConfigurationStore().config.faucetAvailable;
  }

  publicSaleVisible(): boolean {
    return useConfigurationStore().config.publicSaleVisible;
  }

  greenTreasuryVisible(): boolean {
    return useConfigurationStore().config.greenTreasuryVisible;
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
