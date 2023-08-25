import {defineStore} from "pinia";
import {EmailPairingRes} from "@/models/user/emailPairing";
import {AddressType} from "@/components/buyTokens/modals/AddressType";


interface ContextState {
  dataToSign?: EmailPairingRes,
  addressType?: AddressType
}


export const useContextStore = defineStore({
  id: 'contextStore',
  state: (): ContextState => {
    return {
      dataToSign: undefined,
      addressType: undefined

    };
  },
  actions: {

  },
  getters: {

  },
  persist: {
    enabled: true
  }
});
