import {LoggedService} from "@/services/logged.service";
import {LogLevel} from "@/services/logger/log-level";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useConfigurationStore} from "@/store/configuration.store";
import {DataServiceInterface} from "@/services/data.service";

class DataServiceEv extends LoggedService implements DataServiceInterface{

  private static instance: DataServiceEv;
  public static getInstance(): DataServiceEv {
    if (!DataServiceEv.instance) {
      DataServiceEv.instance = new DataServiceEv();
    }
    return DataServiceEv.instance;
  }

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.EV_SERVICE_API;
  }

  public async onAppStart() {
    this.logToConsole(LogLevel.DEBUG, 'onAppStart');
    await useConfigurationStore().fetchConfigList(this).then(() => {
      const config = useConfigurationStore().getConfig;
    });
  }

  private async onInit() {
    this.logToConsole(LogLevel.DEBUG, 'onInit');
  }

  public setIntervals() {
    this.logToConsole(LogLevel.DEBUG, 'setIntervals');
  }

  public clearIntervals() {
    this.logToConsole(LogLevel.DEBUG, 'clearIntervals');
  }

  async waitTillCondition(condition: () => boolean) {
    while (!condition()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  public onConfigurationChange() {
    this.logToConsole(LogLevel.DEBUG, 'onConfigurationChange');
  }
}

export default DataServiceEv.getInstance();
