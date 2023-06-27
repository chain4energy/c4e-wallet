import {PagesEnum} from "@/services/permissions/pages-enum";
import {useI18n} from "vue-i18n";

export class SidebarConfig{

  config = new Map<PagesEnum,SidebarElement>() ;
  i18n = useI18n();

  constructor() {
    this.config.set(PagesEnum.DASHBOARD, this.createDashboard());
    this.config.set(PagesEnum.STAKING, this.createStaking());
    this.config.set(PagesEnum.GOVERNANCE, this.createGovernance());
    this.config.set(PagesEnum.FAUCET, this.createFaucet());
    this.config.set(PagesEnum.AIRDROP, this.createAirDrop());
    this.config.set(PagesEnum.BUYTOKENS, this.createBuyTokens());
    this.config.set(PagesEnum.PROFILE, this.createProfile());
    this.config.set(PagesEnum.PORTFOLIO, this.createPortfolio());
  }

  getConfigForPage(page: PagesEnum): SidebarElement | undefined{
    return this.config.get(page);
  }

  private createDashboard(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 0;
    retVal.href = '/dashboard';
    retVal.title = "Dashboard";
    retVal.icon = new SidebarIcon('LayoutDashboard');
    return retVal;
  }

  private createStaking(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 1;
    retVal.href = '/staking';
    retVal.title = 'Staking';
    retVal.icon = new SidebarIcon('BarChart4');
    return retVal;
  }

  private createGovernance(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 2;
    retVal.href = '/governance';
    retVal.title = 'Governance';
    retVal.icon = new SidebarIcon('Landmark');
    return retVal;
  }

  private createAirDrop(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 3;
    retVal.href = '/airdrop';
    retVal.title = 'Airdrop';
    retVal.icon = new SidebarIcon('Award');
    return retVal;
  }
  private createFaucet(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 4;
    retVal.href = '/faucet';
    retVal.title = 'Faucet';
    retVal.icon = new SidebarIcon('', SideBarIconType.FAUCET);
    return retVal;
  }

  private createBuyTokens(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 5;
    retVal.href = '/buyTokens';
    retVal.title = 'BuyTokens';
    retVal.icon = new SidebarIcon('ShoppingCart');
    return retVal;
  }

  private createProfile(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 6;
    retVal.href = '/profile';
    retVal.title = 'Profile';
    retVal.icon = new SidebarIcon('User');
    return retVal;
  }

  private createPortfolio(): SidebarElement{
    const retVal = new SidebarElement();
    retVal.id = 6;
    retVal.href = '/portfolio';
    retVal.title = 'Portfolio';
    retVal.icon = new SidebarIcon('Wallet');
    return retVal;
  }

}

export class SidebarElement {
  id = 1;
  href = "" ;
  title ="";
  icon = new SidebarIcon('');

}

export enum SideBarIconType {
  LUCIDE,
  GOV,
  FAUCET
}
export class SidebarIcon {
  element: string;
  type: SideBarIconType;
  constructor(element: string, type = SideBarIconType.LUCIDE) {
    this.element = element;
    this.type = type;
  }
}


