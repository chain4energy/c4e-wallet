import { useBlockStore } from "@/store/block.store";
import { useConfigurationStore } from "@/store/configuration.store";
import { useProposalsStore } from "@/store/proposals.store";
import { useSplashStore } from "@/store/splash.store";
import { useTokensStore } from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { useValidatorsStore } from "@/store/validators.store";
import { LoggedService } from "./logged.service";
import { LogLevel } from "./logger/log-level";
import { ServiceTypeEnum } from "./logger/service-type.enum";

const keplrKeyStoreChange = 'keplr_keystorechange';

class DataService extends LoggedService {

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

  private onProposalDetailsError?: () => void;

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
    const config = useConfigurationStore().config;
    this.minBetweenRefreshmentsPeriod = config.minPeriodBetweenDataRefresh;
    this.blockTimeout = config.blockDataRefreshTimeout;
    this.dashboardTimeout = config.dashboardDataRefreshTimeout;
    this.validatorsTimeout = config.validatorsDataRefreshTimeout;
    this.accountTimeout = config.accountDataRefreshTimeout;
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
      useTokensStore().fetchInflation(lockScreen),
      useValidatorsStore().fetchValidators(lockScreen),
      useProposalsStore().fetchTallyParams(),
      useProposalsStore().fetchDepositParams(),
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
    useProposalsStore().clearUserVote();
    useUserStore().logOut();
  }

  public onConfigurationChange() {
    this.logToConsole(LogLevel.DEBUG, 'onConfigurationChange');
    useSplashStore().increment();
    try {
      const refreshProposals = useProposalsStore().hasProposals;
      if (this.onProposalDetailsError) {
        this.onProposalDetailsError();
      }
      this.onLogOut();

      useBlockStore().clear();
      useProposalsStore().clear();
      useTokensStore().clear();
      useValidatorsStore().clear();
      window.clearInterval(this.blockIntervalId);
      window.clearInterval(this.dashboardIntervalId);
      window.clearInterval(this.validatorsIntervalId);
      this.onInit();
      if (refreshProposals) {
        useProposalsStore().fetchProposals(true);
      }
    } finally {
      useSplashStore().decrement();
    }
  }

  public onProposalSelected(proposeId: number, onSuccess: () => void, onError: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onProposalSelected');
    this.onProposalDetailsError = onError;
    useProposalsStore().fetchProposalById(proposeId, onSuccess, onError);
  }

  public onProposalUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onProposalUnselected');
    useProposalsStore().clearProposal();
    this.onProposalDetailsError = undefined;

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
    const instancce = DataService.getInstance();
    instancce.logToConsole(LogLevel.DEBUG, 'onLoginSuccess');

    const now = new Date().getTime();
    instancce.lastAccountTimeout = now;
    instancce.accountIntervalId = window.setInterval(refreshAccountData, instancce.accountTimeout);
    const propId = useProposalsStore().proposal;
    const userAddress = useUserStore().getAccount.address;
    if (propId !== undefined && userAddress !== '') {
      useProposalsStore().fetchProposalUserVote(propId.proposalId, userAddress);
    }
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
    if (!this.skipRefreshing(this.lastAccountTimeout)) {
      useUserStore().fetchAccountData(false).then(() => {
        this.lastAccountTimeout = new Date().getTime();
      })
    }
  }

  public refreshBlocksData() {
    this.logToConsole(LogLevel.DEBUG, 'refreshBlocksData');
    if (!this.skipRefreshing(this.lastBlockTimeout)) {
      useBlockStore().fetchLatestBlock(false).then(() => {
        this.lastBlockTimeout = new Date().getTime();
      })
    }
  }

  public refreshDashboard() {
    this.logToConsole(LogLevel.DEBUG, 'refreshDashboard');
    if (!this.skipRefreshing(this.lastDashboardTimeout)) {
      const lockScreen = false;
      Promise.all([
        useBlockStore().fetchAverageBlockTime(lockScreen),
        useTokensStore().fetchPools(lockScreen),
        useTokensStore().fetchTotalSupply(lockScreen),
        useTokensStore().fetchStakingPool(lockScreen),
        useTokensStore().fetchInflation(lockScreen),
      ]).then(() => {
        this.lastDashboardTimeout = new Date().getTime();
      });
    }
  }

  public refreshValidators() {
    this.logToConsole(LogLevel.DEBUG, 'refreshValidators');
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

