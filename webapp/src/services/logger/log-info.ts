import { LogLevel } from '@/services/logger/log-level';
import { ServiceTypeEnum } from '@/services/logger/service-type.enum';

export class LogInfo {
  level: LogLevel;
  objectType: ServiceTypeEnum;
  message: string;
  data: string[];

  constructor (level: LogLevel, objectType: ServiceTypeEnum, message: string, ...data: string[]) {
    this.level = level;
    this.objectType = objectType;
    this.message = message;
    this.data = data;
  }

  // toString (): any[] {
  //   if (this.data !== undefined && this.data.length > 0) {
  //     return (this.objectType + ' -> ' + this.message, this.data);
  //   } else {
  //     return (this.objectType + ' -> ' + this.message, []);
  //   }
  // }
}
