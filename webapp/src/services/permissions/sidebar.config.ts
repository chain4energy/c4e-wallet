import {PagesEnum} from "@/services/permissions/pages-enum";
import {useI18n} from "vue-i18n";

export class SidebarConfig{

  config = new Map<PagesEnum,SidebarElement>() ;
  i18n = useI18n();

  constructor() {
    this.config.set(PagesEnum.DASHBOARD, this.createDashboard());
    this.config.set(PagesEnum.STAKING, this.createStaking());
    this.config.set(PagesEnum.GOVERNANCE, this.createGovernance());
  }

  getConfigForPage(page: PagesEnum): SidebarElement | undefined{
    return this.config.get(page);
  }

  private createDashboard(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.href = '/dashboard';
    retVal.title = "Dashboard";
    retVal.icon = new SidebarIcon('LayoutDashboard');
    return retVal;
  }

  private createStaking(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.href = '/staking';
    retVal.title = 'Staking';
    retVal.icon = new SidebarIcon('Coins');
    return retVal;
  }

  private createGovernance(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.href = '/governance';
    retVal.title = 'Governance';
    retVal.icon = new SidebarIcon('Wallet');
    return retVal;
  }

  private createValidators(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.href = '/validators';
    retVal.title = 'Validators';
    retVal.icon = new SidebarIcon('FileCheck');
    return retVal;
  }

}

export class SidebarElement {
  href = "" ;
  title ="";
  icon = new SidebarIcon('');

}

export class SidebarIcon {
  element: string;
  constructor(element: string) {
    this.element = element;
  }
}
