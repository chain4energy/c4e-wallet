import { LogInfo } from '@/services/logger/log-info';
import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';

export class LoggerService {
  private numberOfLogsToRemember = 20;
  private logs: LogInfo[] = [];
  private disableConsoleLogsVisible = false;
  private static instance: LoggerService;

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
  }

  logToConsole (logLevel: LogLevel, objectType: ServiceTypeEnum, message: string, ...data: string[]) {
    const logInfo = new LogInfo(logLevel, objectType, message, ...data);

    if (this.logs.length >= this.numberOfLogsToRemember) {
      this.logs.shift();
    }

    this.logs.push(logInfo);
    const now = this.dateToString(new Date());

    const log = (leggerFunc: (...data: any[]) => void): void => {
      const logData: any[] = [now + ' ' + logInfo.level + ': ' + logInfo.objectType + ' -> ' + logInfo.message];
      if (logInfo.data !== undefined && logInfo.data.length > 0) {
        logData.push(logInfo.data.length === 1 ? logInfo.data[0] : logInfo.data);
      }
      leggerFunc(...logData);
    };

    switch (logInfo.level) {
      case LogLevel.ERROR:
        log(console.error);
        break;
      case LogLevel.WARNING:
        log(console.warn);
        break;
    }

    if (!this.disableConsoleLogsVisible) {
      switch (logInfo.level) {
        case LogLevel.INFO:
          log(console.info);
          break;
        case LogLevel.DEBUG:
          log(console.debug);
          break;
        case LogLevel.TRACE:
          log(console.trace);
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
