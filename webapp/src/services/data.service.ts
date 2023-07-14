import {useBlockStore} from "@/store/block.store";
import {useConfigurationStore} from "@/store/configuration.store";
import {useProposalsStore} from "@/store/proposals.store";
import {useSplashStore} from "@/store/splash.store";
import {useTokensStore} from "@/store/tokens.store";
import {useUserStore} from "@/store/user.store";
import {useValidatorsStore} from "@/store/validators.store";
import {LoggedService} from "./logged.service";
import {LogLevel} from "./logger/log-level";
import {ServiceTypeEnum} from "./logger/service-type.enum";
import {ConnectionInfo} from "@/api/wallet.connecton.api";
import {useAirDropStore} from "@/store/airDrop.store";
import {useToast} from "vue-toastification";
import WifiIcon from '@/components/features/WifiOnIcon.vue';
import WifiOffIcon from '@/components/features/WifiOffIcon.vue';
import {useI18n} from "vue-i18n";
import {useUserServiceStore} from "@/store/userService.store";
import {usePublicSalesStore} from "@/store/publicSales.store";
const keplrKeyStoreChange = 'keplr_keystorechange';
const cosmostationKeyStoreChange = 'cosmostation_keystorechange';
const leapKeyStoreChange = 'leap_keystorechange';

class DataService extends LoggedService {

  private minBetweenRefreshmentsPeriod = 1000;
  private blockTimeout = 3000;
  private dashboardTimeout = 3000;
  private validatorsTimeout = 10000;
  private accountTimeout = 10000;
  private spendableTimeout = 10000;
  private lastBlockTimeout = 0;
  private lastDashboardTimeout = 0;
  private lastValidatorsTimeout = 0;
  private lastAccountTimeout = 0;
  private lastSpendablesTimeout = 0;

  private blockIntervalId = 0;
  private dashboardIntervalId = 0;
  private validatorsIntervalId = 0;
  private accountIntervalId = 0;
  private spendablesIntervalId = 0;

  private onProposalDetailsError?: () => void;

  private static instance: DataService;
  private isOnline = navigator.onLine;
  private onClaimAirdropView = false;


  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.DATA_SERVICE;
  }

  public async onAppStart() {
    const i18n = useI18n();
    window.addEventListener('offline', () => {
      this.isOnline = navigator.onLine;
      useToast().error(i18n.t('TOAST.INTERNET_CONNECTION.OFFLINE'), {icon: WifiOffIcon, timeout: false});
      this.clearIntervals();
    });
    window.addEventListener('online', () => {
      this.isOnline = navigator.onLine;
      useToast().clear();
      useToast().error(i18n.t('TOAST.INTERNET_CONNECTION.ONLINE'), {icon: WifiIcon });
      this.setIntervals();
    });
    this.logToConsole(LogLevel.DEBUG, 'onAppStart');
    await useConfigurationStore().fetchConfigList().then(() => {
        const config = useConfigurationStore().getConfig;
        this.minBetweenRefreshmentsPeriod = config.minPeriodBetweenDataRefresh;
        this.blockTimeout = config.blockDataRefreshTimeout;
        this.dashboardTimeout = config.dashboardDataRefreshTimeout;
        this.validatorsTimeout = config.validatorsDataRefreshTimeout;
        this.accountTimeout = config.accountDataRefreshTimeout;
      }
    );
    window.addEventListener('focus', () => {
      if(this.isOnline) {
        this.refreshBlocksData();
        this.refreshDashboard();
        this.refreshValidators();
        this.setIntervals();
      }
    }, false);
    window.addEventListener('blur', () => {
      this.clearIntervals();
    }, false);

    window.ethereum.on('networkChanged', function(networkId: number){
      useUserStore().metamaskConnectionInfo.networkId = networkId;
    });

    window.ethereum.on('accountsChanged', function (accounts: string[]) {
      useUserStore().metamaskConnectionInfo.address = accounts[0];
    });
  }
  private async onInit() {
    this.logToConsole(LogLevel.DEBUG, 'onInit');
    const lockScreen = true;
    await this.waitTillCondition(() => useConfigurationStore().getInitialized);
    if(this.isOnline) {
      Promise.all([
        useBlockStore().fetchLatestBlock(lockScreen),
        useBlockStore().fetchAverageBlockTime(lockScreen),
        useTokensStore().fetchPools(lockScreen),
        useTokensStore().fetchTotalSupply(lockScreen),
        useTokensStore().fetchStakingPool(lockScreen),
        useTokensStore().fetchInflation(lockScreen),
        useTokensStore().fetchLockedVesting(lockScreen),
        useTokensStore().fetchDistributorParams(lockScreen),
        useValidatorsStore().fetchValidators(lockScreen),
        useValidatorsStore().fetchStackingParams(lockScreen),
        useProposalsStore().fetchTallyParams(),
        useProposalsStore().fetchDepositParams(),

      ]).then(() => {
        this.setIntervals();
      });
    }
  }
  public setIntervals() {
    const now = new Date().getTime();
    this.lastBlockTimeout = now;
    this.lastDashboardTimeout = now;
    this.lastValidatorsTimeout = now;
    this.blockIntervalId = window.setInterval(refreshBlocksData, this.blockTimeout);
    this.dashboardIntervalId = window.setInterval(refreshDashboard, this.dashboardTimeout);
    this.validatorsIntervalId = window.setInterval(refreshValidators, this.validatorsTimeout);
  }

  public clearIntervals() {
    window.clearInterval(this.blockIntervalId);
    window.clearInterval(this.dashboardIntervalId);
    window.clearInterval(this.validatorsIntervalId);
  }
  async waitTillCondition(condition: () => boolean) {
    while (!condition()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  public onWindowLoad() {
    this.logToConsole(LogLevel.DEBUG, 'onWindowLoad');
    useUserStore().reconnect(this.onLoginSuccess);
    useUserStore().reconnectMetamask();
  }

  public onKeplrLogIn(onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onKeplrLogIn');
    useUserStore().connectKeplr((connetionInfo: ConnectionInfo) => {
      this.onLoginSuccess(connetionInfo, onSuccess);
    });
  }

  public onCosmostationLogIn(onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onCosmostationLogIn');
    useUserStore().connectCosmostation((connetionInfo: ConnectionInfo) => {
      this.onLoginSuccess(connetionInfo, onSuccess);
    });
  }

  public onLeapLogIn(onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onLeapLogIn');
    useUserStore().connectLeap((connetionInfo: ConnectionInfo) => {
      this.onLoginSuccess(connetionInfo, onSuccess);
    });
  }

  public onAddressLogIn(address: string, onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onAddressLogIn');
    useUserStore().connectAsAddress(address, (connetionInfo: ConnectionInfo) => {this.onLoginSuccess(connetionInfo, onSuccess);});
  }

  public async onMetamaskConnect(onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onMetamaskConnect');
    return useUserStore().connectMetamask(() => this.onMetamaskConnectSuccess(onSuccess));
  }

  public onLogOut() {
    this.logToConsole(LogLevel.DEBUG, 'onLogOut');
    window.clearInterval(this.accountIntervalId);
    this.disableKeplrAccountChangeListener();
    this.disableCosmostationAccountChangeListener();
    this.disableLeapAccountChangeListener();
    // useValidatorsStore().clear();
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
      useUserStore().reconnect(this.onLoginSuccess);

      useBlockStore().clear();
      useProposalsStore().clear();
      useTokensStore().clear();
      useValidatorsStore().clear();
      this.clearIntervals();
      this.onInit().then( () => {
          if (this.onClaimAirdropView && useUserStore().getAccount.address) {
            useAirDropStore().fetchUsersCampaignData(useUserStore().getAccount.address, true);
          }
        }
      );
      if (refreshProposals) {
        useProposalsStore().fetchProposals(true);
      }
    } finally {
      useSplashStore().decrement();
    }
  }

  public onPortfolioSelected() {
    this.logToConsole(LogLevel.DEBUG, 'onPortfolioSelected refreshs');

    this.lastSpendablesTimeout = new Date().getTime();
    this.spendablesIntervalId = window.setInterval(refreshSpendables, this.spendableTimeout);
  }

  public onPortfolioUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onPortfolioUnselected refreshs');
    window.clearInterval(this.spendablesIntervalId);
  }

  public onProposalSelected(proposeId: number, onSuccess: () => void, onError: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onProposalSelected');
    this.onProposalDetailsError = onError;
    useProposalsStore().fetchProposalsDetailsTally(proposeId).then(() => {
      useProposalsStore().fetchProposalById(proposeId, onSuccess, onError);
    });

  }

  public onInfoView() {

    usePublicSalesStore().fetchRoundInfoList();

    if(useUserServiceStore().isLoggedIn) {
      useUserServiceStore().getAccount(()=>{console.log(1);}, ()=>{console.log(2);});
      useUserServiceStore().getKycStatus();
      usePublicSalesStore().fetchTokenReservations();
    }

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
    usePublicSalesStore().toggleWarning(true);
    useUserStore().logOut();
    useUserStore().connectKeplr().then(refreshSpendables);
  }

  public onCosmostationKeyStoreChange() {
    this.logToConsole(LogLevel.DEBUG, 'onCosmostationKeyStoreChange');
    usePublicSalesStore().toggleWarning(true);
    useUserStore().logOut();
    useUserStore().connectCosmostation().then(refreshSpendables);

  }

  public onLeapKeyStoreChange() {
    this.logToConsole(LogLevel.DEBUG, 'onLeapKeyStoreChange');
    usePublicSalesStore().toggleWarning(true);
    useUserStore().logOut();
    useUserStore().connectLeap().then(refreshSpendables);

  }

  private onLoginSuccess(connetionInfo: ConnectionInfo, onSuccess?: () => void) {
    const instancce = DataService.getInstance();
    instancce.logToConsole(LogLevel.DEBUG, 'onLoginSuccess: ' + connetionInfo.isKeplr());
    if (connetionInfo.isKeplr()) {
      instancce.enableKeplrAccountChangeListener();
    }
    if (connetionInfo.isCosmostation()) {
      instancce.enableCosmostationAccountChangeListener();
    }
    if (connetionInfo.isLeap()) {
      instancce.enableLeapAccountChangeListener();
    }
    instancce.lastAccountTimeout = new Date().getTime();
    instancce.accountIntervalId = window.setInterval(refreshAccountData, instancce.accountTimeout);
    const propId = useProposalsStore().proposal;
    const userAddress = useUserStore().getAccount.address;
    if (propId !== undefined && userAddress !== '') {
      useProposalsStore().fetchProposalUserVote(propId.proposalId, userAddress);
    }
    // refresh spendables once logged in
    refreshSpendables();
    if (this.onClaimAirdropView && userAddress) {
        useAirDropStore().fetchUsersCampaignData(userAddress, true);
    }
    if (onSuccess) {
      onSuccess();
    }
  }

  private onMetamaskConnectSuccess(onSuccess?: () => void) {

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
      });
      if(useUserStore().getAccount.address && this.onClaimAirdropView){
        useAirDropStore().fetchUsersCampaignData(useUserStore().getAccount.address, true);
      }
    }

  }

  public refreshSpendables() {
    // f-n refreshing spendable balances from API
    if (useUserStore().getAccount.address) {
      this.logToConsole(LogLevel.DEBUG, 'refreshSpendables');
        useUserStore().updateSpendables().then(() => {
          this.lastSpendablesTimeout = new Date().getTime();
      });
    }
  }

  public refreshBlocksData() {
    this.logToConsole(LogLevel.DEBUG, 'refreshBlocksData');
    if (!this.skipRefreshing(this.lastBlockTimeout)) {
      useBlockStore().fetchLatestBlock(false).then(() => {
        this.lastBlockTimeout = new Date().getTime();
      });
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
        useTokensStore().fetchLockedVesting(lockScreen),
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
      });
    }
  }

  private enableKeplrAccountChangeListener() {
    this.logToConsole(LogLevel.DEBUG, 'enableKeplrAccountChangeListener');
    window.addEventListener(keplrKeyStoreChange, keystoreChangeListener);
  }

  private enableCosmostationAccountChangeListener() {
    this.logToConsole(LogLevel.DEBUG, 'enableCosmostationAccountChangeListener');
    window.addEventListener(cosmostationKeyStoreChange, keystoreCosmostationChangeListener);
  }

  private enableLeapAccountChangeListener() {
    this.logToConsole(LogLevel.DEBUG, 'enableLeapAccountChangeListener');
    window.addEventListener(leapKeyStoreChange, keystoreLeapChangeListener);
  }

  private disableKeplrAccountChangeListener() {
    this.logToConsole(LogLevel.DEBUG, 'disableKeplrAccountChangeListener');
    window.removeEventListener(keplrKeyStoreChange, keystoreChangeListener);
  }

  private disableCosmostationAccountChangeListener() {
    this.logToConsole(LogLevel.DEBUG, 'disableCosmostationAccountChangeListener');
    window.removeEventListener(cosmostationKeyStoreChange, keystoreCosmostationChangeListener);
  }

  private disableLeapAccountChangeListener() {
    this.logToConsole(LogLevel.DEBUG, 'disableLeapAccountChangeListener');
    window.removeEventListener(leapKeyStoreChange, keystoreLeapChangeListener);
  }

  public enterClaimAirdrop() {
    this.logToConsole(LogLevel.DEBUG, 'enterClaimAirdrop');
    this.onClaimAirdropView = true;
    if(useUserStore().getAccount.address){
      useAirDropStore().fetchUsersCampaignData(useUserStore().getAccount.address, true);
    }
  }

  public leaveClaimAirdrop() {
    this.logToConsole(LogLevel.DEBUG, 'leaveClaimAirdrop');
    this.onClaimAirdropView = false;
  }

  public async onProposalUpdateVotes(proposalId: number) {
    this.logToConsole(LogLevel.DEBUG, 'onProposalUpdateVotes');
    await useProposalsStore().fetchVotingProposalTallyResult(proposalId, true, false);
  }
  public onClaimRewards() {
    this.logToConsole(LogLevel.DEBUG, 'onClaimRewards');
    useUserStore().claimRewards();
  }
}

export default DataService.getInstance();

const keystoreChangeListener = () => {
  DataService.getInstance().onKeplrKeyStoreChange();
};

const keystoreCosmostationChangeListener = () => {
  DataService.getInstance().onCosmostationKeyStoreChange();
};

const keystoreLeapChangeListener = () => {
  DataService.getInstance().onLeapKeyStoreChange();
};

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


function refreshSpendables() {
  DataService.getInstance().refreshSpendables();
}
