import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmznMarketplaceService } from 'src/amzn/amzn-marketplace.service';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class MarketplaceScheduler {
  private logger = new Logger(MarketplaceScheduler.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly clientService: ClientService,
    private readonly amznMarketplaceService: AmznMarketplaceService,
  ) {}

  // @Cron('0 0 0 * * *')
  // @Cron('30 * * * * *')
  @Cron(CronExpression.EVERY_30_SECONDS)
  @CreateRequestContext()
  async handlerCron() {
    const clients = await this.clientService.findAll();

    for (const client of clients) {
      try {
        const marketplaces =
          await this.amznMarketplaceService.getMarketplaceParticipations(
            client,
          );

        console.log(marketplaces);
      } catch (err) {
        this.logger.error(err);
      }
    }

    this.logger.debug('Called when the current second is 30');
  }
}
