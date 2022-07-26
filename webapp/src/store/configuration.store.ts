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
      config: Configuration.emptyConfiguration
    };
  },
  actions: {
    fetchConfig(configName: string) {
      // eslint-disable-next-line
      const config = require("../config/json/"+configName);
      this.config = new Configuration(config);
      dataService.onConfigurationChange();
    }
  },
  getters: {

  }
});
