import { defineStore} from "pinia";
import { Configuration} from "@/config/model/Configuration";

export const useConfigurationStore = defineStore({
  id: 'configurationStore',
  state: () => {
    return {
      config: Object() as Configuration
    };
  },
  actions: {
    fetchConfig(configName: string) {
      this.config = require("../config/json/"+configName);
      console.log(this.config);
    }
  },
  getters: {

  }
});
