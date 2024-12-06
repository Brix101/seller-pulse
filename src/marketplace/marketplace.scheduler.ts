import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class MarketplaceScheduler {
  private logger = new Logger(MarketplaceScheduler.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly clientService: ClientService,
  ) {}

  // @Cron('0 0 0 * * *')
  // @Cron('30 * * * * *')
  @Cron(CronExpression.EVERY_30_SECONDS)
  @CreateRequestContext()
  async handlerCron() {
    const clients = await this.clientService.findAll();

    console.log(clients);

    this.logger.debug('Called when the current second is 30');
  }
}
