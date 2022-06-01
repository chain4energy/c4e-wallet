import { inject } from 'vue';
import { LoggerService } from '@/services/logger/logger.service';
import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';

export abstract class LoggedService {
  private logger = inject<LoggerService>('logger') as LoggerService;

  abstract getServiceType(): ServiceTypeEnum;

  protected logToConsole (logLevel: LogLevel, message: string, ...data: string[]) {
    if (data !== undefined && data.length > 0) {
      this.logger.logToConsole(logLevel, this.getServiceType(), message, ...data);
    } else {
      this.logger.logToConsole(logLevel, this.getServiceType(), message);
    }
  }
}
