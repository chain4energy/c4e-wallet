import { useBlockStore } from "@/store/block.store";
import { useConfigurationStore } from "@/store/configuration.store";
import { useProposalsStore } from "@/store/proposals.store";
import { useSplashStore } from "@/store/splash.store";
import { useTokensStore } from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { useValidatorsStore } from "@/store/validators.store";
import { LoggedService, StoreLogger } from "./logged.service";
import { LogLevel } from "./logger/log-level";
import { ServiceTypeEnum } from "./logger/service-type.enum";
import router from "@/router";

const keplrKeyStoreChange = 'keplr_keystorechange';

class DataService extends LoggedService{

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

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.DATA_SERVICE;
  }

  public onAppStart() {
    this.logToConsole(LogLevel.DEBUG, 'onAppStart');
    useConfigurationStore().fetchConfig();
    this.onInit()
  }

  private onInit() {
    this.logToConsole(LogLevel.DEBUG, 'onInit');
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
      this.blockIntervalId = window.setInterval(refreshBlocksData, this.blockTimeout);
      this.dashboardIntervalId = window.setInterval(refreshDashboard, this.dashboardTimeout);
      this.validatorsIntervalId = window.setInterval(refreshValidators, this.validatorsTimeout);

    });
  }

  public onWindowLoad() {
    this.logToConsole(LogLevel.DEBUG, 'onWindowLoad');
    useUserStore().reconnect(this.onLoginSuccess);
  }

  public onKeplrLogIn(onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onKeplrLogIn');
    useUserStore().connectKeplr(() => {
      this.enableKeplrAccountChangeListener();
      this.onLoginSuccess(onSuccess);
    });
  }

  public onAddressLogIn(address: string, onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onAddressLogIn');
    useUserStore().connectAsAddress(address, () => {this.onLoginSuccess(onSuccess)});
  }

  public onLogOut() {
    this.logToConsole(LogLevel.DEBUG, 'onLogOut');
    window.clearInterval(this.accountIntervalId);
    this.disableKeplrAccountChangeListener();
    useUserStore().logOut();
  }

  public onConfigurationChange() {
    this.logToConsole(LogLevel.DEBUG, 'onConfigurationChange');
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
      this.onInit();
    } finally {
      useSplashStore().decrement();
    }
  }

  // public onDashboardSelected() {
  //   useProposalsStore().clear();
  // }

  public onProposalSelected(proposeId: number, onSuccess: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onProposalSelected');
    useProposalsStore().fetchProposalById(proposeId)
  }

  public onGovernanceUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onGovernanceUnselected');
    useProposalsStore().clearProposals();
  }

  public onGovernanceSelected() {
    this.logToConsole(LogLevel.DEBUG, 'onGovernanceSelected');
    useProposalsStore().fetchProposals(true);
  }

  public onGovernanceScroll() {
    this.logToConsole(LogLevel.DEBUG, 'onGovernanceScroll');
    if (useProposalsStore().getPaginationKey) {
      useProposalsStore().fetchProposals(false);
    }
  }

  public onKeplrKeyStoreChange() {
    this.logToConsole(LogLevel.DEBUG, 'onKeplrKeyStoreChange');
    useUserStore().logOut();
    useUserStore().connectKeplr();
  }

  private onLoginSuccess(onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onLoginSuccess');

    const now = new Date().getTime();
    this.lastAccountTimeout = now;
    this.accountIntervalId = window.setInterval(refreshAccountData, this.accountTimeout);
    if (onSuccess) {
      onSuccess();
    }
  }

  private skipRefreshing(lastTimeout: number): boolean {
    const now = new Date().getTime();
    this.logToConsole(
      LogLevel.DEBUG,
      'skipRefreshing: ',
      lastTimeout.toString(),
      this.minBetweenRefreshmentsPeriod.toString(),
      now.toString());
    const result = (lastTimeout + this.minBetweenRefreshmentsPeriod) >= now;
    this.logToConsole(
      LogLevel.DEBUG,
      'skipRefreshing result: ',
      result.toString()
    );
    return result;
  }

  public refreshAccountData() {
    this.logToConsole(LogLevel.DEBUG, 'refreshAccountData');
    // const now = new Date().getTime();
    // const skipRefreshing = (this.lastAccountTimeout + this.minBetweenRefreshmentsPeriod) < now;
    if (!this.skipRefreshing(this.lastAccountTimeout)) {
      useUserStore().fetchAccountData(false).then(() => {
        this.lastAccountTimeout = new Date().getTime();
      })
    }
  }

  public refreshBlocksData() {
    this.logToConsole(LogLevel.DEBUG, 'refreshBlocksData');

    // const now = new Date().getTime();
    // const skipRefreshing = (this.lastBlockTimeout + this.minBetweenRefreshmentsPeriod) < now;
    if (!this.skipRefreshing(this.lastBlockTimeout)) {
      useBlockStore().fetchLatestBlock(false).then(() => {
        this.lastBlockTimeout = new Date().getTime();
      })
    }
  }

  public refreshDashboard() {
    this.logToConsole(LogLevel.DEBUG, 'refreshDashboard');

    // const now = new Date().getTime();
    // const skipRefreshing = (this.lastDashboardTimeout + this.minBetweenRefreshmentsPeriod) < now;
    if (!this.skipRefreshing(this.lastDashboardTimeout)) {
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

  public refreshValidators() {
    this.logToConsole(LogLevel.DEBUG, 'refreshValidators');

    // const now = new Date().getTime();
    // const skipRefreshing = (this.lastValidatorsTimeout + this.minBetweenRefreshmentsPeriod) < now;
    if (!this.skipRefreshing(this.lastValidatorsTimeout)) {
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

function refreshAccountData() {
  DataService.getInstance().refreshAccountData();
}

function refreshBlocksData() {
  DataService.getInstance().refreshBlocksData();
}

function refreshDashboard() {
  DataService.getInstance().refreshDashboard();
}

function refreshValidators() {
  DataService.getInstance().refreshValidators();
}

