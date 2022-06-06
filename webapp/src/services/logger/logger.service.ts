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
    const now = this.dateToString(new Date());
    switch (logInfo.level) {
      case LogLevel.ERROR:
        if (logInfo.data !== undefined && logInfo.data.length > 0) {
          console.error(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
        } else {
          console.error(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message);
        }
        break;
      case LogLevel.WARNING:
        if (logInfo.data !== undefined && logInfo.data.length > 0) {
          console.warn(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
        } else {
          console.warn(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message);
        }
        break;
    }

    if (!this.disableConsoleLogsVisible) {
      switch (logInfo.level) {
        case LogLevel.INFO:
          if (logInfo.data !== undefined && logInfo.data.length > 0) {
            console.info(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
          } else {
            console.info(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message);
          }
          // console.info(logInfo.toString());
          break;
        case LogLevel.DEBUG:
          if (logInfo.data !== undefined && logInfo.data.length > 0) {
            console.log(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
          } else {
            console.log(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message);
          }
          // console.log(logInfo.toString());
          break;
        case LogLevel.TRACE:
          if (logInfo.data !== undefined && logInfo.data.length > 0) {
            console.trace(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message, logInfo.data);
          } else {
            console.trace(now + ' ' + logInfo.objectType + ' -> ' + logInfo.message);
          }
          break;
      }
    }
  }

  getLogs (): LogInfo[] {
    return this.logs;
  }

  private dateToString(date:Date) : string{
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return '' + year + '.' + this.pad(monthIndex,2) + '.' + this.pad(day,2) + ' ' + this.pad(hours,2) + ':' + this.pad(minutes,2) + ':' + this.pad(seconds,2) + '.' + this.pad(milliseconds,4);
  }

  private pad(num:number, size:number):string {
    let numStr = num.toString();
    while (numStr.length < size) numStr = "0" + numStr;
    return numStr;
  }
}
