import { LoggerService } from '@/services/logger/logger.service';
import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';

export abstract class LoggedService {

  static logger:LoggerService = LoggerService.getInstance();

  abstract getServiceType(): ServiceTypeEnum;

  protected logToConsole (logLevel: LogLevel, message: string, ...data: string[]) {
    if (data !== undefined && data.length > 0) {
      LoggedService.logger.logToConsole(logLevel, this.getServiceType(), message, ...data);
    } else {
      LoggedService.logger.logToConsole(logLevel, this.getServiceType(), message);
    }
  }
}

export class StoreLogger extends LoggedService {

  private service: ServiceTypeEnum;

  constructor (service: ServiceTypeEnum) {
    super();
    this.service = service;
  }

  getServiceType(): ServiceTypeEnum {
    return this.service;
  }

  public logToConsole(logLevel: LogLevel, message: string, ...data: string[]) {
    super.logToConsole(logLevel, message, ...data);
  }
}
