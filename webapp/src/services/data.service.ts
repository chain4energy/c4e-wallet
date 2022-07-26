import { useBlockStore } from "@/store/block.store";

class DataService {

  private blockTimeout = 30000;

  private lastBlockTimeout = 0;
  private lastAccountTimeout = 0;
  private lastGovernanceTimeout = 0;
  private lastValidatorsTimeour = 0;

  private static instance: DataService;

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public onAppStart() {
    Promise.all([
      useBlockStore().fetchLatestBlock(true),
    ]).then(() => {
      setInterval(useBlockStore().fetchLatestBlock, this.blockTimeout);
    });
  }

  public onKeplrLoggedIn() {
    
  }

  public onAddressLoggedIn() {
    
  }

  public onLoggedOut() {
    
  }

  public onDashboardSelected() {

  }

  public onStakingSelected() {
    
  }

  public onGovernanceSelected() {
    
  }

  public onConfigurationChange() {

  }

  onBlockTimeout() {

  }

  onAccountTimeout() {
    
  }

  onGovernanceTimeout() {
    
  }

  onValidatorsTimeour() {

  }




}

export default DataService.getInstance();
