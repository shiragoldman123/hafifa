import { ConsoleLogger, Injectable } from '@nestjs/common';
import logger from 'logger-genesis';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor() {
    super();
  }

  private blueColor = (str: string) => `\x1b[34m${str}\x1b[0m`;

  info(isSended: boolean, title: string, message?: string, ...optionalParams: any) {
    logger.info(isSended, 'APP', this.blueColor('[' + this.context + '] ') + title, message ?? title, optionalParams);
    // this.log(title + ' ' + message, ...optionalParams);
  }

  err(isSended: boolean, title: string, message?: string, ...optionalParams: any) {
    logger.error(isSended, 'APP', this.blueColor('[' + this.context + '] ') + title, message ?? title, optionalParams);
    // this.error(message, ...optionalParams);
  }
  warning(isSended: boolean, title: string, message?: string, ...optionalParams: any) {
    logger.warn(isSended, 'APP', this.blueColor('[' + this.context + '] ') + title, message ?? title, optionalParams);
    // this.warn(message, ...optionalParams);
  }
}
