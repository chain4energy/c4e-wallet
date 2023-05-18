import { useRouter } from 'vue-router';
import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';
import { useUserStore } from '@/store/user.store';
import { LoggerService } from '@/services/logger/logger.service';
import {useConfigurationStore} from "@/store/configuration.store";

// why it's here? It shouldn't be global outside the router and imported in App.vue
export function createRouterBeforeEach (logger: LoggerService) {
  useRouter().beforeEach(async (to, from, next) => {
    logger.logToConsole(LogLevel.DEBUG, ServiceTypeEnum.ROUTER, 'go form:' + JSON.stringify(from.name) + ' to:' + JSON.stringify(to.name));
    // If config is not loaded then wait
    if(!useConfigurationStore().getInitialized) {
      await waitTillCondition(() => useConfigurationStore().getInitialized);
    }
    if(to.meta.requiresNotMainNetwork == true && useConfigurationStore().config.isMainNetwork) {
      next('/');
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (useUserStore().isLoggedIn) {
        next();
        return;
      }
      logger.logToConsole(LogLevel.INFO, ServiceTypeEnum.ROUTER, 'user not logged in, redirecting to login page');
      next('/');
    } else {
      logger.logToConsole(LogLevel.INFO, ServiceTypeEnum.ROUTER, 'requiresAuth not defined or FALSE. Route: ' + JSON.stringify(to.name));
      next();
    }
  });
}
async function waitTillCondition(condition: () => boolean) {
  while (!condition()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
