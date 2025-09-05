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
import {Campaign, Mission} from "@/models/store/airdrop";
import {useLoyaltyDropStore} from "@/store/boost.store";
import {ProposalStatus} from "@/models/store/proposal";

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
  private loyaltyDropUserBoostTimeout = 10000;
  private lastBlockTimeout = 0;
  private lastDashboardTimeout = 0;
  private lastValidatorsTimeout = 0;
  private lastAccountTimeout = 0;
  private lastSpendablesTimeout = 0;
  private lastLoyaltyDropUserBoostTimeout = 0;
  private lastLoyaltyDropPoolsConfigTimeout = 0;

  private blockIntervalId = 0;
  private dashboardIntervalId = 0;
  private validatorsIntervalId = 0;
  private accountIntervalId = 0;
  private spendablesIntervalId = 0;
  private loyaltyDropUserBoostIntervalId = 0;
  private loyaltyDropPoolsConfigIntervalId = 0;

  private onProposalDetailsError?: () => void;

  private static instance: DataService;
  private isOnline = navigator.onLine;
  private isClaimAirdropViewSelected = false;
  private isLoyaltyDropViewSelected = false;

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
      DataService.getInstance().logToConsole(LogLevel.DEBUG, 'Event offline');
      this.isOnline = navigator.onLine;
      useToast().error(i18n.t('TOAST.INTERNET_CONNECTION.OFFLINE'), {icon: WifiOffIcon, timeout: false});
      this.clearIntervals();
    });
    window.addEventListener('online', () => {
      DataService.getInstance().logToConsole(LogLevel.DEBUG, 'Event online');
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
        this.loyaltyDropUserBoostTimeout = config.loyaltyDropService.loyaltyDropUserBoostRefreshTimeout;
      }
    );
    window.addEventListener('focus', () => {
      DataService.getInstance().logToConsole(LogLevel.DEBUG, 'Event focus');
      if(this.isOnline) {
        this.refreshBlocksData();
        this.refreshDashboard();
        this.refreshValidators();
        this.refreshLoyaltyDropPoolsConfig();
        this.setIntervals();
        if(useUserStore().isLoggedIn) {
          this.refreshAccountData();
        }
      }
    }, false);
    window.addEventListener('blur', () => {
      DataService.getInstance().logToConsole(LogLevel.DEBUG, 'Event blur');
      this.clearIntervals();
    }, false);


    //TODO: remove all metamask related code

    // check for metamask, throw a toast if not installed and do nothing
    if (!window.ethereum) {
      /*this.logToConsole(LogLevel.ERROR, 'Metamask not installed');      // uncomment to log the error and display a toast
      useToast().error(i18n.t('Metamask not installed.'));*/
      return 0;
    } /*else {
      window.ethereum.on('networkChanged', function(networkId: number){
        DataService.getInstance().logToConsole(LogLevel.DEBUG, 'Ethereum networkChanged');
        useUserStore().metamaskConnectionInfo.networkId = networkId;
      });

      window.ethereum.on('accountsChanged', function (accounts: string[]) {
        DataService.getInstance().logToConsole(LogLevel.DEBUG, 'Ethereum accountsChanged');
        useUserStore().metamaskConnectionInfo.address = accounts[0];
      });
    }*/
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
        useTokensStore().fetchCirculatingSupply(lockScreen),
        useTokensStore().fetchStakingPool(lockScreen),
        useTokensStore().fetchInflation(lockScreen),
        useTokensStore().fetchLockedVesting(lockScreen),
        useTokensStore().fetchDistributorParams(lockScreen),
        useTokensStore().fetchTokenPriceHistory(lockScreen),
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
    this.logToConsole(LogLevel.DEBUG, 'setIntervals');
    const now = new Date().getTime();
    this.lastBlockTimeout = now;
    this.lastDashboardTimeout = now;
    this.lastValidatorsTimeout = now;


    this.blockIntervalId = this.checkAndSetInterval(this.blockIntervalId, refreshBlocksData, this.blockTimeout, "refreshBlocksData");
    this.dashboardIntervalId = this.checkAndSetInterval(this.dashboardIntervalId, refreshDashboard, this.dashboardTimeout, "refreshDashboard");
    this.validatorsIntervalId = this.checkAndSetInterval(this.validatorsIntervalId, refreshValidators, this.validatorsTimeout, "refreshValidators");
    if (useUserStore().isLoggedIn) {
      this.lastAccountTimeout = now;
      this.accountIntervalId = this.checkAndSetInterval(this.accountIntervalId, refreshAccountData, this.accountTimeout, "refreshAccountData");
      if(this.isLoyaltyDropViewSelected){
        this.lastLoyaltyDropUserBoostTimeout = now;
        this.loyaltyDropUserBoostIntervalId = this.checkAndSetInterval(this.loyaltyDropUserBoostIntervalId, refreshLoyaltyDrop, this.loyaltyDropUserBoostTimeout, "refreshLoyaltyDropUserBoost");
      }
    }
  }

  private checkAndSetInterval(intervalId: number, functionToCall: (() => void), timeout: number, extraLogInfo = ''): number {
    this.logToConsole(LogLevel.DEBUG, extraLogInfo + ' checkAndSetInterval:' + timeout);
    if (intervalId != 0) {
      window.clearInterval(intervalId);
    }
    return window.setInterval(functionToCall, timeout);
  }

  public clearIntervals() {
    this.logToConsole(LogLevel.DEBUG, 'clearIntervals');
    window.clearInterval(this.blockIntervalId);
    this.blockIntervalId = 0;
    window.clearInterval(this.dashboardIntervalId);
    this.dashboardIntervalId = 0;
    window.clearInterval(this.validatorsIntervalId);
    this.validatorsIntervalId= 0;
    window.clearInterval(this.accountIntervalId);
    this.accountIntervalId= 0;
    window.clearInterval(this.spendablesIntervalId);
    this.spendablesIntervalId= 0;
    window.clearInterval(this.loyaltyDropUserBoostIntervalId);
    this.loyaltyDropUserBoostIntervalId= 0;

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

  public onLogOutWallet() {
    this.logToConsole(LogLevel.DEBUG, 'onLogOut');
    window.clearInterval(this.accountIntervalId);
    this.disableKeplrAccountChangeListener();
    this.disableCosmostationAccountChangeListener();
    this.disableLeapAccountChangeListener();
    // useValidatorsStore().clear();
    useProposalsStore().clearUserVote();
    useUserStore().logOut();
    useLoyaltyDropStore().clear(false);
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
      useLoyaltyDropStore().clear();
      this.clearIntervals();
      this.onInit().then(() => {
          if (this.isClaimAirdropViewSelected && useUserStore().getAccount.address) {
            useAirDropStore().fetchUsersCampaignData(useUserStore().getAccount.address, true);
          }
          if (this.isLoyaltyDropViewSelected) {
            useLoyaltyDropStore().fetchLoyaltyDropPoolsConfig(true);
            this.refreshLoyaltyDropUserBoost(true, true);
          }
        }
      );
      if (refreshProposals) {
        useProposalsStore().clearProposals();
        useProposalsStore().fetchProposals(true);
      }
    } catch(err) {
      const error = err as Error;
      this.logToConsole(LogLevel.ERROR, "onConfigurationChange ERROR!!!", error.message);
    } finally {
      useSplashStore().decrement();
    }
  }

  public onPortfolioSelected() {
    this.logToConsole(LogLevel.DEBUG, 'onPortfolioSelected refreshs');
    this.refreshSpendables(true, true);
    // this.checkAndSetInterval(this.spendablesIntervalId,()=>{refreshSpendables(false)}, this.spendableTimeout, 'refreshSpendables' );
    // if (useUserStore().isLoggedIn) {
    //   this.refreshAccountData();
    // }
  }

  public onPortfolioUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onPortfolioUnselected');
    // window.clearInterval(this.spendablesIntervalId);
    // this.spendablesIntervalId = 0;
  }

  public onGreenTreasurySelected() {
    this.logToConsole(LogLevel.DEBUG, 'onGreenTreasurySelected');
    // fetch Green Treasury data
  }

  public onGreenTreasuryUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onGreenTreasuryUnselected');
    // clear Green Treasury data
  }

  public async onProposalSelected(proposeId: number, onSuccess: () => void, onError: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onProposalSelected');
    this.onProposalDetailsError = onError;
    console.log("!!!:" + useTokensStore().getTotalBonded );
    //wait for bondedTokens will be fetched
    await this.waitTillCondition(() => {
      return useTokensStore().getStakingPool.bondedTokens != 0n;
    });
    console.log("!!!:" + useTokensStore().getTotalBonded );
    const promises = Array<Promise<any>>();
    promises.push(useProposalsStore().fetchSelectedProposal(proposeId));
    promises.push(useProposalsStore().fetchSelectedProposalDetailsTally(proposeId));
    // promises.push(useProposalsStore().fetchSelectedProposalInfoFromIpfs(proposeId));
    if(useUserStore().isLoggedIn){
      promises.push( useProposalsStore().fetchSelectedProposalUserVote(proposeId, useUserStore().getAccount.address));
    }
    promises.push(useProposalsStore().fetchVotingProposalTallyResult(proposeId, true));
    await Promise.all(promises);

    // await useProposalsStore().fetchSelectedProposal(proposeId);
    // await useProposalsStore().fetchSelectedProposalDetailsTally(proposeId);
    // if(useUserStore().isLoggedIn){
    //   await useProposalsStore().fetchSelectedProposalUserVote(proposeId, useUserStore().getAccount.address);
    // }
    onSuccess?.();
  }

  public onInfoView() {
    this.logToConsole(LogLevel.DEBUG, 'onInfoView');
    usePublicSalesStore().fetchRoundInfoList();
    usePublicSalesStore().fetchRoundInfo(useConfigurationStore().config.currentPublicSaleRoundId, undefined,false);

    if(useUserServiceStore().isLoggedIn) {
      useUserServiceStore().getAccount(()=>{console.log(1);}, ()=>{console.log(2);});
      useUserServiceStore().getKycStatus();
      usePublicSalesStore().fetchTokenReservations();
    }

  }

  public onProposalUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onProposalUnselected');
    // useProposalsStore().clearProposal();
    useProposalsStore().clearSelectedProposal();
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
    useUserStore().connectKeplr((connetionInfo: ConnectionInfo) => {
      this.onLoginSuccess(connetionInfo);
    });
  }

  public onCosmostationKeyStoreChange() {
    this.logToConsole(LogLevel.DEBUG, 'onCosmostationKeyStoreChange');
    usePublicSalesStore().toggleWarning(true);
    useUserStore().logOut();
    useUserStore().connectCosmostation((connetionInfo: ConnectionInfo) => {
      this.onLoginSuccess(connetionInfo);
    });

  }

  public onLeapKeyStoreChange() {
    this.logToConsole(LogLevel.DEBUG, 'onLeapKeyStoreChange');
    usePublicSalesStore().toggleWarning(true);
    useUserStore().logOut();
    useUserStore().connectLeap((connetionInfo: ConnectionInfo) => {
      this.onLoginSuccess(connetionInfo);
    });

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
    instancce.accountIntervalId = instancce.checkAndSetInterval(instancce.accountIntervalId, refreshAccountData, instancce.accountTimeout, "refreshAccountData");
    const propId = useProposalsStore().selectedProposal.proposal;
    const userAddress = useUserStore().getAccount.address;
    if (propId !== undefined && userAddress !== '') {
      useProposalsStore().fetchSelectedProposalUserVote(propId.proposalId, userAddress);
    }
    // refresh spendables once logged in
    // refreshSpendables(true);

    if (instancce.isClaimAirdropViewSelected && userAddress) {
        useAirDropStore().fetchUsersCampaignData(userAddress, true);
    }
    if (instancce.isLoyaltyDropViewSelected){
      useLoyaltyDropStore().fetchLoyaltyDropPoolsConfig( true);
      instancce.refreshLoyaltyDropUserBoost(true, true);
      instancce.lastLoyaltyDropUserBoostTimeout = new Date().getTime();
      instancce.loyaltyDropUserBoostIntervalId = instancce.checkAndSetInterval(instancce.loyaltyDropUserBoostIntervalId, refreshLoyaltyDrop, instancce.loyaltyDropUserBoostTimeout, "refreshLoyaltyDropUserBoost");
    }
    onSuccess?.();
  }

  private onMetamaskConnectSuccess(onSuccess?: () => void) {
    this.logToConsole(LogLevel.DEBUG, 'onMetamaskConnectSuccess');
    if (onSuccess) {
      onSuccess();
    }
  }

  private skipRefreshing(lastTimeout: number, extraLogInfo = ''): boolean {
    const now = new Date().getTime();
    this.logToConsole(
      LogLevel.DEBUG, extraLogInfo + ' skipRefreshing: ', lastTimeout.toString(), this.minBetweenRefreshmentsPeriod.toString(), now.toString(), (now-lastTimeout).toString() );
    const result = (lastTimeout + this.minBetweenRefreshmentsPeriod) >= now;
    this.logToConsole(
      LogLevel.DEBUG, extraLogInfo + ' skipRefreshing result: ', result.toString()
    );
    return result;
  }

  public refreshAccountData() {
    this.logToConsole(LogLevel.DEBUG, 'refreshAccountData');
    if (!this.skipRefreshing(this.lastAccountTimeout, 'refreshAccountData')) {
      useUserStore().fetchAccountData(false).then(() => {
        this.lastAccountTimeout = new Date().getTime();
      });
      this.refreshSpendables(false);
      if(useUserStore().getAccount.address && this.isClaimAirdropViewSelected){
        useAirDropStore().fetchUsersCampaignData(useUserStore().getAccount.address, false);
      }
      if(this.isLoyaltyDropViewSelected){
        this.refreshLoyaltyDropUserBoost(true, true);
      }
      // if(useUserStore().getAccount.address && this.isLoyaltyDropViewSelected){
      //   this.refreshLoyaltyDropUserBoost(false, true);
      //   // useLoyaltyDropStore().fetchLoyaltyDropUserBoost(useUserStore().getAccount.adressd, false);
      // }
    }
  }

  public refreshSpendables(lockscreen: boolean, force = false) {
    // f-n refreshing spendable balances from API
    if (useUserStore().getAccount.address) {
      this.logToConsole(LogLevel.DEBUG, 'refreshSpendables');
      if (force || !this.skipRefreshing(this.lastSpendablesTimeout, 'refreshSpendables')) {
        useUserStore().updateSpendables(lockscreen).then(() => {
          this.lastSpendablesTimeout = new Date().getTime();
        });
      }
    }
  }

  public refreshLoyaltyDropUserBoost(lockscreen: boolean, force = false) {
    if (useUserStore().getAccount.address) {
      this.logToConsole(LogLevel.DEBUG, 'refreshLoyaltyDropUserBoost');
      if (force || !this.skipRefreshing(this.lastLoyaltyDropUserBoostTimeout, 'refreshLoyaltyDropUserBoost')) {
        useLoyaltyDropStore().fetchLoyaltyDropUserBoost(useUserStore().getAccount.address,true).then(() => {
          this.lastLoyaltyDropUserBoostTimeout = new Date().getTime();
        });
      }
    }
  }


  public refreshBlocksData() {
    this.logToConsole(LogLevel.DEBUG, 'refreshBlocksData');
    if (!this.skipRefreshing(this.lastBlockTimeout, 'refreshBlocksData')) {
      useBlockStore().fetchLatestBlock(false).then(() => {
        this.lastBlockTimeout = new Date().getTime();
      });
    }
  }

  public refreshDashboard() {
    this.logToConsole(LogLevel.DEBUG, 'refreshDashboard');
    if (!this.skipRefreshing(this.lastDashboardTimeout, 'refreshDashboard')) {
      const lockScreen = false;
      Promise.all([
        useBlockStore().fetchAverageBlockTime(lockScreen),
        useTokensStore().fetchPools(lockScreen),
        useTokensStore().fetchTotalSupply(lockScreen),
        useTokensStore().fetchCirculatingSupply(lockScreen),
        useTokensStore().fetchStakingPool(lockScreen),
        useTokensStore().fetchInflation(lockScreen),
        useTokensStore().fetchLockedVesting(lockScreen),
        useTokensStore().fetchTokenPriceHistory(lockScreen),
      ]).then(() => {
        this.lastDashboardTimeout = new Date().getTime();
      });
    }
  }

  public refreshValidators() {
    this.logToConsole(LogLevel.DEBUG, 'refreshValidators');
    if (!this.skipRefreshing(this.lastValidatorsTimeout, 'refreshValidators')) {
      useBlockStore().fetchLatestBlock(false).then(() => {
        this.lastValidatorsTimeout = new Date().getTime();
      });
    }
  }

  public refreshLoyaltyDropPoolsConfig() {
    this.logToConsole(LogLevel.DEBUG, 'refreshLoyaltyDropPoolsConfig');
    if (this.isLoyaltyDropViewSelected && !this.skipRefreshing(this.lastLoyaltyDropPoolsConfigTimeout, 'refreshLoyaltyDropPoolsConfig')) {
      useLoyaltyDropStore().fetchLoyaltyDropPoolsConfig(false).then(() => {
        this.lastLoyaltyDropPoolsConfigTimeout = new Date().getTime();
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

  public onClaimAirdropSelected() {
    this.logToConsole(LogLevel.DEBUG, 'onClaimAirdropSelected');
    this.isClaimAirdropViewSelected = true;
    if(useUserStore().getAccount.address){
      useAirDropStore().fetchUsersCampaignData(useUserStore().getAccount.address, true);
    }
  }

  public onClaimAirdropUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onClaimAirdropUnselected');
    this.isClaimAirdropViewSelected = false;
  }

  public onLoyaltyDropSelected() {
    this.logToConsole(LogLevel.DEBUG, 'onLoyaltyDropSelected');
    this.isLoyaltyDropViewSelected = true;
    useLoyaltyDropStore().fetchLoyaltyDropPoolsConfig(true);
    this.refreshLoyaltyDropUserBoost(true, true);
    this.lastLoyaltyDropUserBoostTimeout = new Date().getTime();
    this.loyaltyDropUserBoostIntervalId = this.checkAndSetInterval(this.loyaltyDropUserBoostIntervalId, refreshLoyaltyDrop, this.loyaltyDropUserBoostTimeout, "refreshLoyaltyDropUserBoost");
  }

  public onLoyaltyDropUnselected() {
    this.logToConsole(LogLevel.DEBUG, 'onLoyaltyDropUnselected');
    this.isLoyaltyDropViewSelected = false;
    window.clearInterval(this.loyaltyDropUserBoostIntervalId);
    this.loyaltyDropUserBoostIntervalId= 0;
  }

  public async onCreateVestingPoolLoyaltyDrop(vestingPoolName: string, amount:number, vestingPeriod: number, vestingType: string, onSuccess?: () => void){
    await useUserStore().createVestingPoolLoyaltyDrop(vestingPoolName, amount, vestingPeriod, vestingType).then((isTransactionOk)=>{
      if(isTransactionOk) {
        onSuccess?.();
      }
    });
  }

  public async onVestingPoolWithdrawAllAvailable(onSuccess?: () => void){
    await useUserStore().vestingPoolWithdrawAllAvailable().then((isTransactionOk)=>{
      if(isTransactionOk) {
        onSuccess?.();
      }
    });
  }

  public async onProposalUpdateVotes(proposalId: number) {
    this.logToConsole(LogLevel.DEBUG, 'onProposalUpdateVotes');
    await useProposalsStore().fetchVotingProposalTallyResult(proposalId, true, false);
  }

  public onClaimRewards() {
    this.logToConsole(LogLevel.DEBUG, 'onClaimRewards');
    useUserStore().claimRewards();
  }

  public async onClaimInitialAirdrop(campaign: Campaign, mission: Mission, address: string, onSuccessClaim?: (campaign: Campaign, mission: Mission) => void){
    await useUserStore().claimInitialAirdrop(campaign.id, address).then((isTransactionOk)=>{
      if(isTransactionOk) {
        useAirDropStore().fetchUsersCampaignData(useUserStore().account.address, true);
        onSuccessClaim?.(campaign, mission);
      }
    });
  }

  public async onClaimOtherAirdrop(campaign: Campaign, mission: Mission, onSuccessClaim?: (campaign: Campaign, mission: Mission) => void) {
    await useUserStore().claimOtherAirdrop(campaign.id, mission.id).then((isTransactionOk) => {
      if(isTransactionOk) {
        useAirDropStore().fetchUsersCampaignData(useUserStore().account.address, true);
        onSuccessClaim?.(campaign, mission);
      }
    });
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


function refreshSpendables(lockscreen: boolean) {
  DataService.getInstance().refreshSpendables(lockscreen);
}

function refreshLoyaltyDrop() {
  DataService.getInstance().refreshLoyaltyDropUserBoost(false);
  DataService.getInstance().refreshLoyaltyDropPoolsConfig();
}
