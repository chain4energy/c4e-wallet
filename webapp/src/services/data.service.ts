import { useBlockStore } from "@/store/block.store";
import { useProposalsStore } from "@/store/proposals.store";
import { useSplashStore } from "@/store/splash.store";
import { useTokensStore } from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { useValidatorsStore } from "@/store/validators.store";

const keplrKeyStoreChange = 'keplr_keystorechange';

class DataService {

  private minBetweenRefreshmentsPeriod = 1000;
  private blockTimeout = 3000;
  private dashboardTimeout = 3000;
  private validatorsTimeout = 10000;
  private accountTimeout = 10000;

  private lastBlockTimeout = 0;
  private lastDashboardTimeout = 0;
  private lastValidatorsTimeout = 0;
  private lastAccountTimeout = 0;

  private blockIntervalId = 0;
  private dashboardIntervalId = 0;
  private validatorsIntervalId = 0;
  private accountIntervalId = 0;

  private static instance: DataService;

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public onAppStart() {
    const lockScreen = true;
    Promise.all([
      useBlockStore().fetchLatestBlock(lockScreen),
      useBlockStore().fetchAverageBlockTime(lockScreen),
      useTokensStore().fetchPools(lockScreen),
      useTokensStore().fetchTotalSupply(lockScreen),
      useTokensStore().fetchStakingPool(lockScreen),
      useValidatorsStore().fetchValidators(lockScreen),
      useProposalsStore().fetchTallyParams(),
    ]).then(() => {
      const now = new Date().getTime();
      this.lastBlockTimeout = now;
      this.lastDashboardTimeout = now;
      this.lastValidatorsTimeout = now;
      // this.blockIntervalId = window.setInterval(this.refreshBlocksData, this.blockTimeout);
      // this.dashboardIntervalId = window.setInterval(this.refreshDashboard, this.dashboardTimeout);
      // this.validatorsIntervalId = window.setInterval(this.refreshValidators, this.validatorsTimeout);

    });
  }

  public onWindowLoad() {
    useUserStore().reconnect(this.onLoginSuccess);
  }

  public onKeplrLogIn(onSuccess?: () => void) {
    useUserStore().connectKeplr(() => {
      this.enableKeplrAccountChangeListener();
      this.onLoginSuccess(onSuccess);
    });
  }

  public onAddressLogIn(address: string, onSuccess?: () => void) {
    useUserStore().connectAsAddress(address, () => {this.onLoginSuccess(onSuccess)});
  }

  public onLogOut() {
    window.clearInterval(this.accountIntervalId);
    this.disableKeplrAccountChangeListener();
    useUserStore().logOut();
  }

  public onConfigurationChange() {
    useSplashStore().increment();
    try {
      this.onLogOut();
      useBlockStore().clear();
      useProposalsStore().clear();
      useTokensStore().clear();
      useValidatorsStore().clear();
      window.clearInterval(this.blockIntervalId);
      window.clearInterval(this.dashboardIntervalId);
      window.clearInterval(this.validatorsIntervalId);
      this.onAppStart();
    } finally {
      useSplashStore().decrement();
    }
  }

  // public onDashboardSelected() {
  //   useProposalsStore().clear();
  // }

  public onProposalSelected(proposeId: number, onSuccess: () => void) {
    useProposalsStore().fetchProposalById(proposeId).then(onSuccess);
  }

  public onGovernanceUnselected() {
    useProposalsStore().clearProposals();
  }

  public onGovernanceSelected() {
    useProposalsStore().fetchProposals(true);
  }

  public onGovernanceScroll() {
    if (useProposalsStore().getPaginationKey) {
      useProposalsStore().fetchProposals(false);
    }
  }

  public onKeplrKeyStoreChange() {
    useUserStore().logOut();
    useUserStore().connectKeplr();
  }

  private onLoginSuccess(onSuccess?: () => void) {
    // const now = new Date().getTime();
    // this.lastAccountTimeout = now;
    // this.accountIntervalId = window.setInterval(this.refreshAccountData, this.accountTimeout);
    if (onSuccess) {
      onSuccess();
    }
  }

  private skipRefresh(lastTimeout: number): boolean {
    const now = new Date().getTime();
    return lastTimeout + this.minBetweenRefreshmentsPeriod < now;
  }

  private refreshAccountData() {
    if (!this.skipRefresh(this.lastAccountTimeout)) {
      useUserStore().fetchAccountData(false).then(() => {
        this.lastAccountTimeout = new Date().getTime();
      })
    }
  }

  private refreshBlocksData() {
    if (!this.skipRefresh(this.lastBlockTimeout)) {
      useBlockStore().fetchLatestBlock(false).then(() => {
        this.lastBlockTimeout = new Date().getTime();
      })
    }
  }

  private refreshDashboard() {
    if (!this.skipRefresh(this.lastDashboardTimeout)) {
      const lockScreen = false;
      Promise.all([
        useBlockStore().fetchAverageBlockTime(lockScreen),
        useTokensStore().fetchPools(lockScreen),
        useTokensStore().fetchTotalSupply(lockScreen),
        useTokensStore().fetchStakingPool(lockScreen),
      ]).then(() => {
        this.lastDashboardTimeout = new Date().getTime();
      });
    }
  }

  private refreshValidators() {
    if (!this.skipRefresh(this.lastValidatorsTimeout)) {
      useBlockStore().fetchLatestBlock(false).then(() => {
        this.lastValidatorsTimeout = new Date().getTime();
      })
    }
  }

  private enableKeplrAccountChangeListener() {
    window.addEventListener(keplrKeyStoreChange, keystoreChangeListener);
  }
  
  private disableKeplrAccountChangeListener() {
    window.removeEventListener(keplrKeyStoreChange, keystoreChangeListener);
  }

}

export default DataService.getInstance();

const keystoreChangeListener = () => {
  DataService.getInstance().onKeplrKeyStoreChange();
}

