import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmznMarketplaceService } from 'src/amzn/amzn-marketplace.service';
import { ClientService } from 'src/client/client.service';
import { Marketplace } from './entities/marketplace.entity';

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
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @CreateRequestContext()
  async handlerCron() {
    const clients = await this.clientService.findAll();

    for (const client of clients) {
      try {
        const marketplaces =
          await this.amznMarketplaceService.getMarketplaceParticipations(
            client,
          );

        await this.orm.em.transactional(async (em) => {
          for (const marketplace of marketplaces) {
            const newMarketplace = em.create(Marketplace, {
              ...marketplace,
              client,
            });

            await em.upsert(Marketplace, newMarketplace);
          }
        });

        console.log(marketplaces);
      } catch (err) {
        this.logger.error(err);
      }
    }

    this.logger.debug('Called when the current second is 30');
  }
}
