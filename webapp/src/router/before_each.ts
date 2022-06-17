import { useRouter } from 'vue-router';
import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';
import { useUserStore } from '@/store/user.store';
import { LoggerService } from '@/services/logger/logger.service';

// why it's here? It shouldn't be global outside the router and imported in App.vue
export function createRouterBeforeEach (logger: LoggerService) {
  useRouter().beforeEach((to, from, next) => {
    logger.logToConsole(LogLevel.DEBUG, ServiceTypeEnum.ROUTER, 'go form:' + JSON.stringify(from.name) + ' to:' + JSON.stringify(to.name));
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
