import { LogInfo } from '@/services/logger/log-info';
import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';

export class LoggerService {
  numberOfLogsToRemember = 20;
  logs: LogInfo[] = [];
  disableConsoleLogsVisible = false;

  // TODO: poprawić logowanie tak żeby nie było tablicy w przypadku gdy jest jednoelementowa

  logToConsole (logLevel: LogLevel, objectType: ServiceTypeEnum, message: string, ...data: string[]) {
    const logInfo = new LogInfo(logLevel, objectType, message, ...data);

    if (this.logs.length >= this.numberOfLogsToRemember) {
      this.logs.splice(0, 1); // remove 1 item at 0-index position
    }

    this.logs.push(logInfo);

    switch (logInfo.level) {
      case LogLevel.ERROR:
        if (logInfo.data !== undefined && logInfo.data.length > 0) {
          console.error(logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
        } else {
          console.error(logInfo.objectType + ' -> ' + logInfo.message);
        }
        break;
      case LogLevel.WARNING:
        if (logInfo.data !== undefined && logInfo.data.length > 0) {
          console.warn(logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
        } else {
          console.warn(logInfo.objectType + ' -> ' + logInfo.message);
        }
        break;
    }

    if (!this.disableConsoleLogsVisible) {
      switch (logInfo.level) {
        case LogLevel.INFO:
          if (logInfo.data !== undefined && logInfo.data.length > 0) {
            console.info(logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
          } else {
            console.info(logInfo.objectType + ' -> ' + logInfo.message);
          }
          // console.info(logInfo.toString());
          break;
        case LogLevel.DEBUG:
          if (logInfo.data !== undefined && logInfo.data.length > 0) {
            console.log(logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
          } else {
            console.log(logInfo.objectType + ' -> ' + logInfo.message);
          }
          // console.log(logInfo.toString());
          break;
        case LogLevel.TRACE:
          if (logInfo.data !== undefined && logInfo.data.length > 0) {
            console.trace(logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
          } else {
            console.trace(logInfo.objectType + ' -> ' + logInfo.message);
          }
          break;
      }
    }
  }

  getLogs (): LogInfo[] {
    return this.logs;
  }
}
