import { defineStore } from "pinia";
import { Configuration } from "@/config/model/store/Configuration";
import dataService from "@/services/data.service";
import apiFactory from "@/api/factory.api";
import axios from "axios";

interface ConfigurationState {
  config: Configuration
  configName: string
  configList: Map<string, Configuration>,
  initialized: boolean
}

const defaultConfigName = '';

export const useConfigurationStore = defineStore({
  id: 'configurationStore',
  state: (): ConfigurationState => {
    return {
      config: new Configuration(),
      configName: defaultConfigName,
      configList: new Map<string, Configuration>(),
      initialized: false
    };
  },
  actions: {
    // fetchConfig(configName?: string) {
    //   logger.logToConsole(LogLevel.DEBUG, 'fetchConfig: ', String(configName));
    //
    //   logger.logToConsole(LogLevel.DEBUG, 'current configName: ', this.configName);
    //   const oldConfig = this.config.isEmpty;
    //   this.configName = configName ? configName : this.configName;
    //   logger.logToConsole(LogLevel.DEBUG, 'selected configName: ', this.configName);
    //
      //let fileName = getConfigurationProfiles().get(this.configName);
      //logger.logToConsole(LogLevel.DEBUG, 'selected fileName: ', String(fileName));

      // if (!fileName) {
      //   // this.configName = defaultConfigName;
      //   //fileName = getConfigurationProfiles().get(this.configName);
      // }

      // eslint-disable-next-line
      //const config = require("../config/json/" + getConfigurationProfiles().get(this.configName));

      //this.config = new Configuration(config);
      // if (this.config.testMode && this.config.testFileName) {
      //   apiFactory.runTestMode(this.config.testFileName);
      // } else {
      //   apiFactory.runNormalMode();
      // }
      //
      // if (!oldConfig) {
      //   dataService.onConfigurationChange();
      // }
    // },


    async fetchConfigList(){
      this.configList = new Map<string, Configuration>();
      if(this.config.isEmpty && this.configList.size < 1){
        await axios.get('/config.json').then((res ) => {
          for(const key in res.data){
            if(process.env.VUE_APP_TEST_PROFILES_ACTIVE){
              this.configList.set(key, new Configuration(res.data[key]) );
            } else if(!process.env.VUE_APP_TEST_PROFILES_ACTIVE && !res.data[key]?.testMode){
              this.configList.set(key, new Configuration(res.data[key]) );
            }
            if (res.data[key].isMainNetwork) {
              this.configList.set(key, new Configuration(res.data[key]) );
              this.setNetwork(key);
            }
          }
        });
      } else if(!this.config.isEmpty && this.configList.size <= 1 ) {
        await axios.get('/config.json').then((res ) => {
          for(const key in res.data){
            if(process.env.VUE_APP_TEST_PROFILES_ACTIVE){
              this.configList.set(key, new Configuration(res.data[key]) );
            } else if(!process.env.VUE_APP_TEST_PROFILES_ACTIVE && !res.data[key]?.testMode){
              this.configList.set(key, new Configuration(res.data[key]) );
            }
            if (res.data[key].networkName === this.config.networkName) {
              this.configList.set(key, new Configuration(res.data[key]) );
              this.setNetwork(key);
            }
          }
        });
      } else {
        dataService.onConfigurationChange();
      }
      this.initialized = true;
      return this.config;
    },
    setNetwork(key: string){
      this.configName = this.configList.get(key)?.networkName || '';
      this.config = this.configList.get(key) || new Configuration();
      if (this.config.testMode && this.config.testFileName) {
        apiFactory.runTestMode(this.config.testFileName);
      } else {
        apiFactory.runNormalMode();
      }
      dataService.onConfigurationChange();
    }
  },
  getters: {
    getConfigName(): string {
      return this.configName;
    },
    getConfigList(): Map<string, Configuration>{
      return this.configList as Map<string, Configuration>;
    },
    getConfig(): Configuration {
      return new Configuration(this.config);
    },
    getInitialized(): boolean {
      return this.initialized;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { storage: sessionStorage, paths: ['configName', "config","configList"] },
    ]
  }
});
