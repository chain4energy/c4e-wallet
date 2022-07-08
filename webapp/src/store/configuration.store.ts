import { defineStore} from "pinia";
import { Configuration} from "@/config/model/Configuration";

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
      this.config = require("../config/json/"+configName);
    }
  },
  getters: {

  }
});
