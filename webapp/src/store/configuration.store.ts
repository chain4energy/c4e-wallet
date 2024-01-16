import { defineStore } from "pinia";
import { Configuration } from "@/config/model/store/Configuration";
import {DataServiceInterface} from "@/services/data.service";
import apiFactory from "@/api/factory.api";
import axios from "axios";

interface ConfigurationState {
  config: Configuration
  configName: string
  configList: Map<string, Configuration>,
  initialized: boolean
  configurationChangeHandler?: DataServiceInterface
}

const defaultConfigName = '';

export const useConfigurationStore = defineStore({
  id: 'configurationStore',
  state: (): ConfigurationState => {
    return {
      config: new Configuration(),
      configName: defaultConfigName,
      configList: new Map<string, Configuration>(),
      initialized: false,
      configurationChangeHandler: undefined
    };
  },
  actions: {
    async fetchConfigList(dataService: DataServiceInterface){
      this.configurationChangeHandler = dataService;
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
        this.configurationChangeHandler?.onConfigurationChange();
      }
      this.initialized = true;
      return this.config;
    },
    setNetwork( key: string){
      this.configName = this.configList.get(key)?.networkName || '';
      this.config = this.configList.get(key) || new Configuration();
      if (this.config.testMode && this.config.testFileName) {
        apiFactory.runTestMode(this.config.testFileName);
      } else {
        apiFactory.runNormalMode();
      }
      this.configurationChangeHandler?.onConfigurationChange();
    }
  },
  getters: {
    getConfigName(): string {
      return this.configName;
    },
    // getConfigList(): UnwrapRef<ConfigurationState["configList"]>{
    //   return this.configList;
    // },
    getConfigList(): Map<string, Configuration>{
      return this.configList;
    },
    getConfig(): Configuration {
      return new Configuration(this.config);
    },
    getInitialized(): boolean {
      return this.initialized;
    }
  },
  persist: {
     storage: sessionStorage, paths: ['configName', "config","configList"]
  }
});
