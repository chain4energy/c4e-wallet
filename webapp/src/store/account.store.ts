import {defineStore} from "pinia";
import apiFactory from "@/api/factory.api";
import {DataHolder} from "@/models/data-holder";
import {Proposal} from "@/models/Proposal";
import {TallyParams} from "@/models/GovernanceParameters";
import { Account } from "@/models/account";

export const useAccountStore = defineStore({
  id: 'accountStore',
  state: () => {

    return {
      account: Object(Account),
    };
  },
  actions: {
    async fetchAccount(id: string) {
      await apiFactory.accountApi().fetchAccount(id).then(response => {
        if (response.error == null && response.data != undefined) {
          this.account = response.data.account;

        } else {
          //TODO: error handling
        }

      });
    },
  },
  getters: {

    getAccount(): Account{
      return this.account;
    },
  }
});
