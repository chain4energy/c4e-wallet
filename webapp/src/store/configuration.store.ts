import { defineStore} from "pinia";
import { Configuration as JsonConfiguration} from "@/config/model/json/Configuration";
import { Configuration} from "@/config/model/store/Configuration";

interface ConfigurationState {
  config: Configuration
}

export const useConfigurationStore = defineStore({
  id: 'configurationStore',
  state: (): ConfigurationState => {
    return {
      config: Object()
    };
  },
  actions: {
    fetchConfig(configName: string) {
      // eslint-disable-next-line
      const config = require("../config/json/"+configName);
      this.config = new Configuration(config);

    }
  },
  getters: {

  }
});
