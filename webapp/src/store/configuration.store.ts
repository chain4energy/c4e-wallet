import { defineStore } from "pinia";
import { Configuration } from "@/config/model/store/Configuration";
import dataService from "@/services/data.service";
import apiFactory from "@/api/factory.api";
import { getConfigurationProfiles, getIntialProfile } from "@/config/configuration.profiles";
import { StoreLogger } from "@/services/logged.service";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { LogLevel } from "@/services/logger/log-level";

const logger = new StoreLogger(ServiceTypeEnum.CONFIG_STORE);


interface ConfigurationState {
  config: Configuration
  configName: string
}

const defaultConfigName = getIntialProfile().name;

export const useConfigurationStore = defineStore({
  id: 'configurationStore',
  state: (): ConfigurationState => {
    return {
      config: new Configuration(),
      configName: defaultConfigName
    };
  },
  actions: {
    fetchConfig(configName?: string) {
      logger.logToConsole(LogLevel.DEBUG, 'fetchConfig: ', String(configName));

      logger.logToConsole(LogLevel.DEBUG, 'current configName: ', this.configName);
      const oldConfig = this.config.isEmpty;
      this.configName = configName ? configName : this.configName;
      logger.logToConsole(LogLevel.DEBUG, 'selected configName: ', this.configName);

      let fileName = getConfigurationProfiles().get(this.configName);
      logger.logToConsole(LogLevel.DEBUG, 'selected fileName: ', String(fileName));

      if (!fileName) {
        this.configName = defaultConfigName;
        fileName = getConfigurationProfiles().get(this.configName);
      }

      // eslint-disable-next-line
      const config = require("../config/json/" + getConfigurationProfiles().get(this.configName));

      this.config = new Configuration(config);
      if (this.config.testMode && this.config.testFileName) {
        apiFactory.runTestMode(this.config.testFileName);
      } else {
        apiFactory.runNormalMode();
      }

      if (!oldConfig) {
        dataService.onConfigurationChange();
      }
    }
  },
  getters: {
    getConfigName(): string {
      return this.configName;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: sessionStorage, paths: ['configName'] },
    ]
  }
});
