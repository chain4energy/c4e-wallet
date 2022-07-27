import { defineStore} from "pinia";
import { Configuration} from "@/config/model/store/Configuration";
import dataService from "@/services/data.service";

interface ConfigurationState {
  config: Configuration
}

export const useConfigurationStore = defineStore({
  id: 'configurationStore',
  state: (): ConfigurationState => {
    return {
      config: new Configuration()
    };
  },
  actions: {
    fetchConfig(configName: string) {
      const oldConfig = this.config.isEmpty
      // eslint-disable-next-line
      const config = require("../config/json/"+configName);
      console.log('this.config: ' + oldConfig)
      console.log('emptyConfiguration: ' + Configuration.emptyConfiguration.isEmpty)

      
      this.config = new Configuration(config);
      if (!oldConfig) {
        dataService.onConfigurationChange();
      }
    }
  },
  getters: {

  }
});
