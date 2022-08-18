import i18n from "@/plugins/i18n";
import { useConfigurationStore } from "@/store/configuration.store";

export function changeTitle() :void {
  let chainName: string; 
  if(!useConfigurationStore().config.isMainNetwork){
    chainName = ` (${useConfigurationStore().getConfigName})`;
  } else {
    chainName = '';
  }
  document.title = i18n.global.t("TITLE", {addInfo: chainName});
}
