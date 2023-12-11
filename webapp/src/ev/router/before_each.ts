import { useRouter } from 'vue-router';
import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';
import { LoggerService } from '@/services/logger/logger.service';
import {useConfigurationStore} from "@/store/configuration.store";
import {useUserServiceStore} from "@/store/userService.store";

// why it's here? It shouldn't be global outside the router and imported in App.vue
export function createRouterBeforeEach (logger: LoggerService) {
  useRouter().beforeEach(async (to, from, next) => {
    logger.logToConsole(LogLevel.DEBUG, ServiceTypeEnum.ROUTER, 'go form:' + JSON.stringify(from.name) + ' to:' + JSON.stringify(to.name));
    // If config is not loaded then wait
    if(!useConfigurationStore().getInitialized) {
      await waitTillCondition(() => useConfigurationStore().getInitialized);
    }
    next();
  });
}
async function waitTillCondition(condition: () => boolean) {
  while (!condition()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
