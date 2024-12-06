import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MarketplaceScheduler {
  private logger = new Logger(MarketplaceScheduler.name);

  // @Cron('0 0 0 * * *')
  // @Cron('30 * * * * *')
  @Cron(CronExpression.EVERY_30_SECONDS)
  handlerCron() {
    this.logger.debug('Called when the current second is 30');
  }
}
